import React, {Component} from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';
import './panel-style.css'

const drawerWidth = 450;

export default class SidePanel extends Component {
    constructor() {
      
      super();

      this.state = {};
    }

    render() {

    const {
      data,
      selected
    } = this.props;
      
    if (selected === "link") {

      let timeline = "от " + data.nodes[0].year.toString() + " до " + data.nodes[1].year.toString();

      return (
        <Drawer
              variant="permanent"
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
              }}
            >
            <Toolbar />
              <Card sx={{ minWidth: 275 }}> 
                  <CardHeader
                    avatar = {
                      <Avatar aria-label="time-selection">
                        T
                      </Avatar>
                    }
                    titleTypographyProps={{variant:'h6'}}
                    title="Временной диапазон"
                    subheader={timeline}
                  />
                <CardContent>
                  <Typography variant="h6">
                    Связанные элементы
                  </Typography>
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  {data.nodes.map(item =>
                    <ListItem key = {item.id}>
                        <ListItemIcon>
                          <StarIcon /> 
                        </ListItemIcon>
                        <ListItemText primary={item.status + " " + item.name} secondary={"от " + item.year} />
                    </ListItem>
                  )}
                  </List>
                </CardContent>
              </Card>
        </Drawer>
      )
    }

    return (

      <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
          >
          <Toolbar />
          {data.nodes.map(item => 
              <Card sx={{ minWidth: 275 }} key = {item.id}>
                <CardHeader
                  avatar = {
                    <Avatar src={item.svg} />
                  }
                  titleTypographyProps={{variant:'h6'}}
                  title={item.status + " " + item.name}
                  subheader={item.ceo}
                />
                <CardContent>
                  <Typography variant="body2">
                    {item.description}
                  </Typography>
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} style={{ display: 'flex', flexDirection: 'row'}}>
                      <ListItem>
                          <ListItemIcon>
                            <CalendarTodayIcon sx={{ml: -2}} />
                          </ListItemIcon>
                          <ListItemText sx={{ml: -5}} secondary={"Создан в " + item.year + " году"}/>
                      </ListItem>
                    </List>
                </CardContent>
              </Card>
          )}
      </Drawer>
    )
  }
}
