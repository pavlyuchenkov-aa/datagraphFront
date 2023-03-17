import App from './App';
import React from 'react';
import axios from 'axios';
import { mount, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { act } from 'react-dom/test-utils';
import { MEDIA_SERVER_URL, MINI_GRAPH_DATA_URL } from './constants/routes';
import { cleanup, waitFor } from '@testing-library/react';
import mockData from './mockData';
import Filters from './components/Filters/Filters';

configure({ adapter: new Adapter() });

const whenStable = async () => {
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
};

afterEach(() => {
    cleanup();
})

describe('<App />', () => {
    describe("<App /> unit tests", () => {
        it("should render with fetched data", async () => {
            const axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValueOnce({
                data: {
                    "id": 79,
                    "name": "VK",
                    "ceo": "Владимир Сергеевич Кириенко",
                    "description": "VK — крупнейшая российская технологическая компания, которая объединяет социальные сети, коммуникационные сервисы, игры, образование и многое другое. Проектами VK пользуются больше 90% аудитории рунета. Сегодня VK это не только социальная сеть, но и более 200 продуктов и сервисов для людей и бизнеса.",
                    "staffSize": 8842,
                    "year": "1998-10-01T00:00:00Z",
                    "departments": [
                        "Связь",
                        "Финансы",
                        "IT",
                        "Торговля",
                        "Развлечения"
                    ],
                    "products": [
                        {
                            "id": 28,
                            "name": "Дзен",
                            "year": "2022-08-10T00:00:00Z",
                            "isVerified": true
                        },
                        {
                            "id": 30,
                            "name": "Яндекс Дзен",
                            "year": "2022-12-20T00:00:00Z",
                            "isVerified": false
                        },
                        {
                            "id": 32,
                            "name": "Vkontakte",
                            "year": "2006-09-19T00:00:00Z",
                            "isVerified": false
                        },
                        {
                            "id": 34,
                            "name": "Vkontakte",
                            "year": "2009-11-13T00:00:00Z",
                            "isVerified": false
                        },
                        {
                            "id": 36,
                            "name": "Vkontakte",
                            "year": "2013-04-17T00:00:00Z",
                            "isVerified": true
                        },
                        {
                            "id": 38,
                            "name": "Mail.ru",
                            "year": "1998-04-22T00:00:00Z",
                            "isVerified": false
                        },
                        {
                            "id": 40,
                            "name": "Mail.ru",
                            "year": "2002-06-11T00:00:00Z",
                            "isVerified": false
                        }
                    ],
                    "svg": "http://141.95.127.215:8082/media-server/data/f65df5df0cb6241377deafb69d35d620.png"
                }
            });
            const wrapper = mount(<App />);
            await whenStable();

            expect(axiosGetSpy).toBeCalledWith(MINI_GRAPH_DATA_URL);
            axiosGetSpy.mockRestore();
        });

        it("should call onZoomIn on + button click", async () => {
            const app = mount(<App />);
            const spy = jest.spyOn(app.instance(), "onZoomIn");
            app.instance().forceUpdate();
            act(() => {
                app.find({ "data-testid": "zoomInButton" }).simulate("click");
            });
            expect(spy).toHaveBeenCalled();
        });

        it("should call onZoomOut on - button click", async () => {
            const app = mount(<App />);
            const spy = jest.spyOn(app.instance(), "onZoomOut");
            app.instance().forceUpdate();
            act(() => {
                app.find({ "data-testid": "zoomOutButton" }).simulate("click");
            });
            expect(spy).toHaveBeenCalled();
        });

        it("should call onClickNode method when node button is clicked", async () => {
            const wrapper = mount(<App />);
            await whenStable();
            const instance = wrapper.instance();
            const spy = jest.spyOn(instance, 'onClickNode');
            await waitFor(() => {
                instance.onClickNode(38);
            });
            expect(spy).toHaveBeenCalledWith(38);
        });

        it("should call onClickLink method when link between company and product is clicked", async () => {
            const wrapper = mount(<App />);
            await whenStable();
            const instance = wrapper.instance();
            const spy = jest.spyOn(instance, 'onClickLink');
            await waitFor(() => {
                instance.onClickLink(35, 28);
            });

            expect(spy).toHaveBeenCalledWith(35, 28);
        });

        it("should call onClickLink method when link between product and product is clicked", async () => {
            const wrapper = mount(<App />);
            await whenStable();
            const instance = wrapper.instance();
            const spy = jest.spyOn(instance, 'onClickLink');
            await waitFor(() => {
                instance.onClickLink(28, 30);
            });
            expect(spy).toHaveBeenCalledWith(28, 30);
        });

        it("should call clearFilters with correct params", async () => {
            const wrapper = mount(<App />);
            await whenStable();
            const instance = wrapper.instance();
            const spy = jest.spyOn(instance, 'clearFilters');
            await waitFor(() => {
                instance.clearFilters();
            });
            expect(spy).toHaveBeenCalled();
        });

        it("should call changeNodesOpacity with correct params", async () => {
            const wrapper = mount(<App />);
            await whenStable();
            const instance = wrapper.instance();
            const spy = jest.spyOn(instance, 'changeNodesOpacity');

            await waitFor(() => {
                instance.changeNodesOpacity([78, 52, 54, 56, 59, 61, 65]);
            });

            expect(spy).toHaveBeenCalledWith([78, 52, 54, 56, 59, 61, 65]);
        });
    })

    describe("<App /> integration tests", () => {
        it('should respond with status code 200 when server is available', async () => {
            const response = await axios.get(MEDIA_SERVER_URL + "/ping/");
            expect(response.status).toBe(200);

            //http://localhost:7328/link/company?source=35&target=28
        });

        it("should fetch correct product data from API Server on node click", async () => {
            const wrapper = mount(<App />);
            await whenStable();
            const spy = jest.spyOn(wrapper.instance(), 'fetchNodeData');

            const graph = wrapper.find({ "data-testid": "graphTest" });
            expect(graph).toHaveLength(1);
            await waitFor(() => {
                graph.props().onClickNode(38);
            })

            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy).toHaveBeenCalledWith(mockData.shortGraphMock, 3);
        });

        it("should fetch correct company data from API Server on node click", async () => {
            const wrapper = mount(<App />);
            await whenStable();
            const spy = jest.spyOn(wrapper.instance(), 'fetchNodeData');

            const graph = wrapper.find({ "data-testid": "graphTest" });
            expect(graph).toHaveLength(1);
            await waitFor(() => {
                graph.props().onClickNode(35);
            })

            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy).toHaveBeenCalledWith(mockData.shortGraphMock, 0);
        })

        it("should fetch correct link data from API Server", async () => {
            const wrapper = mount(<App />);
            await whenStable();
            const spy = jest.spyOn(wrapper.instance(), 'getLinkData');

            const graph = wrapper.find({ "data-testid": "graphTest" });
            expect(graph).toHaveLength(1);
            await waitFor(() => {
                graph.props().onClickLink(35, 28);
            })

            
            expect(spy).toHaveBeenCalledWith("http://localhost:7328/link/company?source=35&target=28", "Компания");
        })

        it("should fetch correct full graph data from API Server when zoom scale is more 1", async () => {
            const wrapper = mount(<App />);
            await whenStable();
            await waitFor(() => {
                wrapper.find({ "data-testid": "zoomInButton" }).simulate("click");
                wrapper.find({ "data-testid": "zoomInButton" }).simulate("click");
                wrapper.find({ "data-testid": "zoomInButton" }).simulate("click");
                expect(wrapper.state('graphData')).toEqual(mockData.fullGraphMock);
            });
        })

        it("should fetch correct mini graph data from API Server when zoom scale value changes from 1 to 0.75", async () => {
            const wrapper = mount(<App />);
            await whenStable();
            await waitFor(() => {
                wrapper.find({ "data-testid": "zoomInButton" }).simulate("click");
                wrapper.find({ "data-testid": "zoomInButton" }).simulate("click");
                wrapper.find({ "data-testid": "zoomInButton" }).simulate("click");
                wrapper.find({ "data-testid": "zoomOutButton" }).simulate("click");
                console.log(wrapper.state('graphData'));
                expect(wrapper.state('graphData')).toEqual(mockData.shortGraphMock);
            });
        })

        it("should fetch correct mini graph data on render from API Server", async () => {
            const fetchGraphDataMock = jest.spyOn(App.prototype, 'fetchGraphData');
            const wrapper = mount(<App />);
            await whenStable();
            await waitFor(() => {
                expect(wrapper.state('graphData')).toEqual(mockData.shortGraphMock);
            });

            expect(fetchGraphDataMock).toHaveBeenCalled();
            expect(wrapper.state('isFetching')).toBe(false);
        })

        it("should fetch correct data from API Server on company filters' apply button click", async () => {
            const wrapper = mount(<App />);
            await whenStable();
            const spy = jest.spyOn(wrapper.instance(), 'changeNodesOpacity');

            const filters = wrapper.find(Filters).instance();
            await waitFor(() => {
                filters.setState({
                    companyName: "",
                    departments: [],
                    ceo: "",
                    minDate: "1991-01-01T00:00:00Z",
                    maxDate: "2000-01-01T00:00:00Z",
                    startStaffSize: 100000,
                    endStaffSize: 400000
                });
                filters.forceUpdate();
                filters.applyCompanyFilters();
                expect(spy).toHaveBeenCalledWith([35, 24, 25, 26, 28, 29, 30]);
            });
        })

        it("should fetch correct data from API Server on product filters' apply button click", async () => {
            const wrapper = mount(<App />);
            await whenStable();
            const spy = jest.spyOn(wrapper.instance(), 'changeNodesOpacity');

            const filters = wrapper.find(Filters).instance();
            await waitFor(() => {
                filters.setState({
                    productName: "Ozon.ru",
                    productLifetime: [1996, 2000],
                    isProductVerified: false
                });
                filters.forceUpdate();
                filters.applyProductFilters();
                expect(spy).toHaveBeenCalledWith([20]);
            });
        })
    })
});


