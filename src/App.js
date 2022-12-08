import { Graph } from 'react-d3-graph';
import React, {Component} from 'react';
import ZoomControlButtons from './components/ZoomControlButtons/';
import myConfig from './myConfig';
import Header from './components/Header/'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import SidePanel from './components/SidePanel';

const graphData = {
  nodes: [
    { id: "1", x: 800, y: 400, svg: "https://icons.iconarchive.com/icons/sicons/basic-round-social/256/yandex-icon.png", status: "Компания", name: "Yandex", ceo: "Аркадий Волож", year: 2000, description: "Яндекс — одна из крупнейших IT-компаний в России. Мы развиваем самую популярную в стране поисковую систему и создаем сервисы, которые помогают людям в повседневных делах."}, 
    { id: "2", x: 700, y: 600, svg: "https://icons.iconarchive.com/icons/papirus-team/papirus-apps/256/yandex-browser-beta-icon.png", status: "Продукт", name: "Yandex Browser", year: 2012, description: "Яндекс Браузер — это бесплатный веб-браузер, разработанный российской технологической корпорацией Яндекс, который использует движок веб-браузера Blink и основан на проекте с открытым исходным кодом Chromium."}, 
    { id: "3", x: 900, y: 600, svg: "https://icons.iconarchive.com/icons/papirus-team/papirus-places/256/folder-blue-yandex-disk-icon.png", status: "Продукт", name: "Yandex Disk", year: 2013, description: "Яндекс.Диск — облачный сервис, принадлежащий компании Яндекс, позволяющий пользователям хранить свои данные на серверах в «облаке» и передавать их другим пользователям в Интернете."}]
  ,
  links: [
    { source: "1", target: "2" },
    { source: "1", target: "3" }
  ]
};

export default class App extends Component {
  constructor(props) {
    
    super(props);

    this.state = {
      config: myConfig,
      data: graphData,
      selectedElementData: {
        nodes: [graphData.nodes[0]],
        links: [graphData.links.find(element => element.source === 1)]
      },
      selectedElement: 'node'
    }

    this.onClickNode = (nodeId) => {

      function filterLinksById(jsonObject, id) {
        return jsonObject.filter(function(jsonObject) {
          return (jsonObject['source'] === id);
        });
      }

      const selectedObject = {
        nodes: [],
        links: []
      }

      const nodeIndex = this.state.data.nodes.findIndex(element => element.id === nodeId);

      const selectedNodeInfo = this.state.data.nodes[nodeIndex];
      selectedObject['nodes'].push(selectedNodeInfo);

      if (this.state.data.links.find(element => element.source === nodeId)) {
        const selectedNodeLinks = filterLinksById(this.state.data['links'], nodeId);
        selectedObject['links'].push(selectedNodeLinks);
      }
  
      this.setState({
        selectedElementData: selectedObject,
        selectedElement: "node"
      });
    }

    this.onClickLink = (source, target) => {
      const selectedObject = {
        nodes: []
      }

      const sourceIndex = this.state.data.nodes.findIndex(element => element.id === source);
      const targetIndex = this.state.data.nodes.findIndex(element => element.id === target);

      selectedObject['nodes'].push(this.state.data.nodes[sourceIndex]);
      selectedObject['nodes'].push(this.state.data.nodes[targetIndex]);

      console.log(selectedObject)

      this.setState({
        selectedElementData: selectedObject,
        selectedElement: "link"
      });
    }

    this.onZoomIn = () => {
      this.setState(prevState => {
        let config = Object.assign({}, prevState.config); 
        config.initialZoom += 0.5;      
        return { config };                     
      })
    }

    this.onZoomOut = () => {
      this.setState(prevState => {
        let config = Object.assign({}, prevState.config); 
        config.initialZoom -= 0.5;                                     
        return { config };                     
      })
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }


  render() {
    const {config} = this.state;
    const {selectedElementData} = this.state;
    const {selectedElement} = this.state;

    return (
      <div className="App">
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Header />
          <SidePanel data={selectedElementData} selected={selectedElement}/>
          <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f0f0f0' }}>
            <ZoomControlButtons 
              onZoomIn = {this.onZoomIn}
              onZoomOut = {this.onZoomOut}
            />
            <Graph 
              id = {"company-data"}
              data = {graphData}
              config = {config}
              onClickNode = {this.onClickNode}
              onClickLink = {this.onClickLink}
            />
          </Box>
        </Box>
      </div>
    )
  }
}


