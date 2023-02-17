import App from './App';
import axios from 'axios';
import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { act } from 'react-dom/test-utils';
import { MINI_GRAPH_DATA_URL } from './constants/globalVariables';
import { cleanup } from '@testing-library/react';

configure({ adapter: new Adapter() });

const whenStable = async () => {
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
};

export const waitFor = (callback, { interval = 50, timeout = 1000 } = {}) =>
    act(
        () =>
            new Promise((resolve, reject) => {
                const startTime = Date.now()

                const nextInterval = () => {
                    setTimeout(() => {
                        try {
                            callback()
                            resolve()
                        } catch (err) {
                            if (Date.now() - startTime > timeout) {
                                reject(new Error('Timed out.'))
                            } else {
                                nextInterval()
                            }
                        }
                    }, interval)
                }

                nextInterval()
            }),
    )

afterEach(() => {
    cleanup();
});

describe('<App />', () => {
      
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
            instance.onClickLink(78, 59);
        });
        expect(spy).toHaveBeenCalledWith(78, 59);
    });

    it("should call onClickLink method when link between product and product is clicked", async () => {
        const wrapper = mount(<App />);
        await whenStable();
        const instance = wrapper.instance();
        const spy = jest.spyOn(instance, 'onClickLink');
        await waitFor(() => {
            instance.onClickLink(38, 40);
        });
        expect(spy).toHaveBeenCalledWith(38, 40);
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
});