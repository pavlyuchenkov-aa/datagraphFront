import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Graph } from 'react-d3-graph';
import axios from 'axios';
import ZoomControlButtons from './components/ZoomControlButtons/ZoomControlButtons';
import moment from 'moment';
import myConfig from './myConfig';
import Header from './components/Header/Header'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import SidePanel from './components/SidePanel/SidePanel';
import { SERVER_URL, MINI_GRAPH_DATA_URL, FULL_GRAPH_DATA_URL } from './constants/globalVariables';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.reactRef = React.createRef();
    this.panelRef = React.createRef();
    this.state = {
      config: myConfig,
      graphData: [],
      isFetching: false
    };
  }

  componentDidMount() {
    this.setState({ isFetching: true });
    this.fetchGraphData(MINI_GRAPH_DATA_URL);
  }

  fetchGraphData(query) {
    console.log("graph rendered");
    axios.get(query)
      .then(response => {
        this.setState({ graphData: response.data });
        this.fetchNodeData(response.data, 0);
        this.setState({ isFetching: false });
      })
      .catch(e => {
        console.log(e);
        this.setState({ config: {} });
        this.setState({ graphData: [] });
      });
  }

  fetchNodeData(data, nodeIndex) {
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

    console.log(query);

    axios.get(query)
      .then(response => {
        this.panelRef.current.showSelectedElementData(response.data)
        console.log(response.data);
        this.panelRef.current.showSelectedElementType(nodeType)
      })
      .catch(e => {
        console.log(e);
      });
  }

  onClickNode = (nodeId) => {
    if (this.state.graphData.nodes.find(element => element.id == nodeId).opacity < 1) {
      return;
    }

    const nodeIndex = this.state.graphData.nodes.findIndex(element => element.id == nodeId);
    this.fetchNodeData(this.state.graphData, nodeIndex);
  };

  onClickLink = (source, target) => {
    let query = '';
    let sourceNodeType = '';

    if (this.state.graphData.nodes.find(element => element.id == source).nodeType == "Компания") {
      query = SERVER_URL + "link/company?source=" + source + "&target=" + target;
      sourceNodeType = "Компания";
    }
    else if (this.state.graphData.nodes.find(element => element.id == source).nodeType == "Продукт") {
      query = SERVER_URL + "link/products?source=" + source + "&target=" + target;
      sourceNodeType = "Продукт";
    }

    this.getLinkData(query, sourceNodeType);
  }

  onZoomIn = () => {
    let newConfig = { ...this.state.config };
    newConfig.initialZoom += 0.25;

    if (newConfig.initialZoom >= newConfig.maxZoom) {
      newConfig.initialZoom = newConfig.maxZoom;
    }

    if (newConfig.initialZoom > 1) {
      this.fetchGraphData(FULL_GRAPH_DATA_URL);
    }

    this.setState({ config: newConfig });

    console.log(newConfig.initialZoom)
  }

  onZoomOut = () => {
    let newConfig = { ...this.state.config };
    newConfig.initialZoom -= 0.25;

    if (newConfig.initialZoom <= newConfig.minZoom) {
      newConfig.initialZoom = newConfig.minZoom;
    }

    if (newConfig.initialZoom <= 1) {
      this.fetchGraphData(MINI_GRAPH_DATA_URL);
    }

    this.setState({ config: newConfig });

    console.log(newConfig.initialZoom)
  }

  getLinkData = (query, sourceNodeType) => {
    var linkInfo = { timeline: '', sourceNodeName: '', targetNodeName: '', sourceNodeYear: null, targetNodeYear: null };

    axios.get(query)
      .then(response => {
        linkInfo.timeline = "от " + moment(response.data[Object.keys(response.data)[0]].year).utc().format('YYYY') + " до " + moment(response.data[Object.keys(response.data)[1]].year).utc().format('YYYY');
        linkInfo.sourceNodeName = sourceNodeType + " " + response.data[Object.keys(response.data)[0]].name;
        linkInfo.targetNodeName = "Продукт " + response.data[Object.keys(response.data)[1]].name;
        linkInfo.sourceNodeYear = response.data[Object.keys(response.data)[0]].year;
        linkInfo.targetNodeYear = response.data[Object.keys(response.data)[1]].year;

        this.panelRef.current.showSelectedElementData(linkInfo)
        this.panelRef.current.showSelectedElementType("link")
      })
      .catch(e => {
        console.log(e);
      });
  }

  clearFilters = () => {
    let newGraphData = { ...this.state.graphData }

    newGraphData.nodes.map((el) => {
      el.opacity = 1;
    });

    newGraphData.links.map((el) => {
      el.opacity = 1;
    })

    this.setState({ graphData: newGraphData });
  }

  changeNodesOpacity = (nodeIds) => {
    let newGraphData = { ...this.state.graphData }

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

    this.setState({ graphData: newGraphData });
  }

  render() {
    return (
      <div className="App" data-testid="dataGraph">
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Header changeNodesOpacity={this.changeNodesOpacity} clearFilters={this.clearFilters} />
          <SidePanel ref={this.panelRef} isFetching={this.state.isFetching} />
          <Box component="main"
            sx={{
              backgroundColor: '#f0f0f0'
            }}
          >
            <ZoomControlButtons
              data-testid="zoomBtns"
              onZoomIn={this.onZoomIn}
              onZoomOut={this.onZoomOut}
            />
            <Graph
              data-testid="hi"
              ref={this.reactRef}
              id={"company-data"}
              data={this.state.graphData}
              config={this.state.config}
              onClickNode={this.onClickNode}
              onClickLink={this.onClickLink}
            />
          </Box>
        </Box>
      </div>
    );
  }
}

export default App;