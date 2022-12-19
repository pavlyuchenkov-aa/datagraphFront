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
import { SERVER_URL, MINI_GRAPH_DATA_URL, FULL_GRAPH_DATA_URL} from './constants/globalVariables';

export default function App() {
  const reactRef = useRef(null);
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
      query = SERVER_URL + "link/company?source=" + source + "&target=" + target;
      sourceNodeType = "Компания";
    }
    else if (graphData.nodes.find(element => element.id == source).nodeType == "Продукт") {
      query = SERVER_URL + "link/products?source=" + source + "&target=" + target;
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
    setIsFetching(true);
    fetchGraphData(MINI_GRAPH_DATA_URL);
  }, [fetchGraphData])

  const fetchNodeData = (data, nodeIndex) => {
    let query = '';
    let nodeType = '';

    if (data.nodes[nodeIndex].nodeType == "Компания") {
      nodeType = "companyNode";
      query = SERVER_URL + "company?id=" + data.nodes[nodeIndex].id;
    }
    else if (data.nodes[nodeIndex].nodeType == "Продукт") {
      nodeType = "productNode";
      query = SERVER_URL + "product?id=" + data.nodes[nodeIndex].id;
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
        <Header changeNodesOpacity={changeNodesOpacity} clearFilters={clearFilters} />
        <SidePanel ref={panelRef} isFetching={isFetching} />
        <Box component="main" 
          sx = {{
            backgroundColor: '#f0f0f0'
          }}
        >
          <ZoomControlButtons
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
          />
          <Graph
            ref={reactRef}
            id={"company-data"}
            data={graphData}
            config={config}
            onClickNode={onClickNode}
            onClickLink={onClickLink}
          />
        </Box>
      </Box>
    </div>
  );
}
