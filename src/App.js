import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Graph } from 'react-d3-graph';
import axios from 'axios';
import ZoomControlButtons from './components/ZoomControlButtons/';
import moment from 'moment';
import myConfig from './myConfig';
import Header from './components/Header/Header'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import SidePanel from './components/SidePanel/SidePanel';

const FULL_GRAPH_DATA_URL= 'http://localhost:7328/get:full';
const MINI_GRAPH_DATA_URL = 'http://localhost:7328/get:short';

export default function App() {
  const panelRef = useRef(null);
  const [config, setConfig] = useState(myConfig);
  const [graphData, setGraphData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const onClickNode = (nodeId) => {
    if (graphData.nodes.find(element => element.id == nodeId).opacity < 1) {
      return;
    }

    const nodeIndex = graphData.nodes.findIndex(element => element.id == nodeId);
    fetchNodeData(graphData, nodeIndex);
  };

  const onClickLink = (source, target) => {
    let query = '';
    let sourceNodeType = '';

    if (graphData.nodes.find(element => element.id == source).nodeType == "Компания") {
      query = "http://localhost:7328/link/company?source=" + source + "&target=" + target;
      sourceNodeType = "Компания";
    }
    else if (graphData.nodes.find(element => element.id == source).nodeType == "Продукт") {
      query = "http://localhost:7328/link/products?source=" + source + "&target=" + target;
      sourceNodeType = "Продукт";
    }

    getLinkData(query, sourceNodeType);
  }

  const onZoomIn = () => {
    const newConfig = { ...config };
      newConfig.initialZoom += 0.25;

      if (newConfig.initialZoom >= newConfig.maxZoom) {
        newConfig.initialZoom = newConfig.maxZoom;
      } 

      if (newConfig.initialZoom > 1) {
        fetchGraphData(FULL_GRAPH_DATA_URL);
      }

      setConfig(newConfig);

      console.log(newConfig.initialZoom)
  }

  const onZoomOut = () => {
      const newConfig = { ...config };
      newConfig.initialZoom -= 0.25;

      if (newConfig.initialZoom <= newConfig.minZoom) {
        newConfig.initialZoom = newConfig.minZoom;
      } 

      if (newConfig.initialZoom <= 1) {
        fetchGraphData(MINI_GRAPH_DATA_URL);
      }

      setConfig(newConfig);

      console.log(newConfig.initialZoom)
  }

  const fetchGraphData = useCallback((query) => {
    console.log("graph rendered");
    axios.get(query)
      .then(response => {
        setGraphData(response.data)
        fetchNodeData(response.data, 0);
        setIsFetching(false);
      })
      .catch(e => {
        console.log(e);
        setConfig({});
        setGraphData([]);
      });
  }, [])

  useEffect(() => {
    setConfig(myConfig);
    setIsFetching(true);
    fetchGraphData(MINI_GRAPH_DATA_URL);
  }, [fetchGraphData])

  const fetchNodeData = (data, nodeIndex) => {
    let query = '';
    let nodeType = '';

    if (data.nodes[nodeIndex].nodeType == "Компания") {
      nodeType = "companyNode";
      query = 'http://localhost:7328/company?id=' + data.nodes[nodeIndex].id;
    }
    else if (data.nodes[nodeIndex].nodeType == "Продукт") {
      nodeType = "productNode";
      query = 'http://localhost:7328/product?id=' + data.nodes[nodeIndex].id;
    }

    axios.get(query)
      .then(response => {
        panelRef.current.showSelectedElementData(response.data)
        panelRef.current.showSelectedElementType(nodeType)
      })
      .catch(e => {
        console.log(e);
      });
  }

  const getLinkData = (query, sourceNodeType) => {
    var linkInfo = { timeline: '', sourceNodeName: '', targetNodeName: '', sourceNodeYear: null, targetNodeYear: null };

    axios.get(query)
      .then(response => {
        linkInfo.timeline = "от " + moment(response.data[Object.keys(response.data)[0]].year).utc().format('YYYY') + " до " + moment(response.data[Object.keys(response.data)[1]].year).utc().format('YYYY');
        linkInfo.sourceNodeName = sourceNodeType + " " + response.data[Object.keys(response.data)[0]].name;
        linkInfo.targetNodeName = "Продукт " + response.data[Object.keys(response.data)[1]].name;
        linkInfo.sourceNodeYear = response.data[Object.keys(response.data)[0]].year;
        linkInfo.targetNodeYear = response.data[Object.keys(response.data)[1]].year;

        panelRef.current.showSelectedElementData(linkInfo)
        panelRef.current.showSelectedElementType("link")
      })
      .catch(e => {
        console.log(e);
      });
  }

  const onZoomChange = (prevZoom, newZoom) => {
    /*
    const changeZoomView = 0.4;

    if (newZoom >= changeZoomView) {
      fetchGraphData(FULL_GRAPH_DATA_URL);
    }

    if (newZoom < changeZoomView) {
      fetchGraphData(MINI_GRAPH_DATA_URL);
    }
    */

  }

  const clearFilters = () => {
    const newGraphData = { ...graphData }

    newGraphData.nodes.map((el) => {
      el.opacity = 1;
    });

    newGraphData.links.map((el) => {
      el.opacity = 1;
    })

    setGraphData(newGraphData);
  }

  const changeNodesOpacity = (nodeIds) => {
    const newGraphData = { ...graphData }

    newGraphData.nodes.map((el) => {
      if (nodeIds.includes(el.id)) {
        el.opacity = 1;
      }
      else {
        el.opacity = 0.1;
      }
    });

    newGraphData.links.map((el) => {
    
      if (nodeIds.includes(el.source) && nodeIds.includes(el.target)) {
        el.opacity = 1;
      }
      else {
        el.opacity = 0.1;
      }
    })

    setGraphData(newGraphData);
  }

  return (
    <div className="App">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header changeNodesOpacity={changeNodesOpacity} clearFilters={clearFilters}/>
        <SidePanel ref={panelRef} isFetching={isFetching} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f0f0f0' }}>
          <ZoomControlButtons
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
          />
          <Graph
            id={"company-data"}
            data={graphData}
            config={config}
            onClickNode={onClickNode}
            onClickLink={onClickLink}
            onZoomChange={onZoomChange}
          />
        </Box>
      </Box>
    </div>
  );
}
