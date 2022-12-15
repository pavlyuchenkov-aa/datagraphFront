import React, { useState, useEffect, useRef } from 'react';
import { Graph } from 'react-d3-graph';
import axios from 'axios';
import ZoomControlButtons from './components/ZoomControlButtons/';
import moment from 'moment';
import myConfig from './myConfig';
import Header from './components/Header/Header'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import SidePanel from './components/SidePanel/SidePanel';

const GRAPH_DATA_URL = 'http://localhost:7328/get:short';

export default function App() {
  const panelRef = useRef(null);
  const [config, setConfig] = useState(myConfig);
  const [graphData, setGraphData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const onClickNode = (nodeId) => {
    console.log(nodeId);
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
    setConfig(newConfig);
  }

  const onZoomOut = () => {
    const newConfig = { ...config };
    newConfig.initialZoom -= 0.25;
    setConfig(newConfig);
  }

  useEffect(() => {
    setConfig(myConfig);
    setIsFetching(true);
    const fetchGraphData = () => {
      axios.get(GRAPH_DATA_URL)
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
    };

    fetchGraphData();
  }, [])

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

  return (
    <div className="App">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header />
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
          />
        </Box>
      </Box>
    </div>
  );
}
