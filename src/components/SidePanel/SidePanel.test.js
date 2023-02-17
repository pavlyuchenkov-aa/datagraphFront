import { render, screen, cleanup, act } from '@testing-library/react'
import SidePanel from './SidePanel'
import '@testing-library/jest-dom'
import { configure } from 'enzyme'
import { createRef } from 'react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

afterEach(() => {
    cleanup();
});

describe("<SidePanel />", () => {
    it("should render side panel", () => {
        render(<SidePanel />);
        var sidePanelElement = screen.getByTestId("side-panel");
        expect(sidePanelElement).toBeInTheDocument();
    });

    it("should render side panel for company node", () => {
        const ref = createRef();

        const companySelectedData = {
            "id": 78,
            "name": "СБЕР",
            "ceo": "Герман Оскарович Греф",
            "description": "ПАО Сбербанк - российский финансовый конгломерат, крупнейший универсальный банк России и Восточной Европы. По итогам 2019 года у Сбербанка 96,2 миллионов активных частных клиентов и 2,6 миллиона активных корпоративных клиентов.",
            "staffSize": 285000,
            "year": "1991-06-20T00:00:00Z",
            "departments": [
                "Финансы",
                "IT",
                "Торговля"
            ],
            "products": [
                {
                    "id": 52,
                    "name": "SberbankOnline",
                    "year": "2012-10-16T00:00:00Z",
                    "isVerified": false
                },
                {
                    "id": 54,
                    "name": "SberbankOnline",
                    "year": "2014-07-24T00:00:00Z",
                    "isVerified": false
                },
                {
                    "id": 56,
                    "name": "SberbankOnline",
                    "year": "2016-07-21T00:00:00Z",
                    "isVerified": false
                },
                {
                    "id": 59,
                    "name": "SberApp",
                    "year": "2015-12-17T00:00:00Z",
                    "isVerified": false
                },
                {
                    "id": 61,
                    "name": "SberApp",
                    "year": "2017-12-15T00:00:00Z",
                    "isVerified": false
                },
                {
                    "id": 65,
                    "name": "SberApp",
                    "year": "2020-12-17T00:00:00Z",
                    "isVerified": true
                }
            ],
            "svg": "http://141.95.127.215:8082/media-server/data/20ad243690efeb01588568f452f8593a.jpg"
        }

        render(<SidePanel ref={ref} />);
        act(() => ref.current.showSelectedElementType("companyNode"));
        act(() => ref.current.showSelectedElementData(companySelectedData));
        expect(screen.queryByTestId("companyHeader")).toBeVisible();
    });

    it("should render side panel for product node", () => {
        const ref = createRef();

        const productSelectedData = {
            "id": 36,
            "name": "Vkontakte",
            "version": "3.0",
            "company": {
                "id": 2,
                "name": "VK"
            },
            "link": "https://vk.com/press/vk-video",
            "description": "v3",
            "svg": "http://141.95.127.215:8082/media-server/data/f65df5df0cb6241377deafb69d35d620.png",
            "year": "2013-04-17T00:00:00Z",
            "departments": [
                {
                    "id": 123,
                    "name": "Связь"
                },
                {
                    "id": 44,
                    "name": "IT"
                },
                {
                    "id": 44,
                    "name": "Развлечения"
                }
            ]
        }

        render(<SidePanel ref={ref} />);
        act(() => ref.current.showSelectedElementType("productNode"));
        act(() => ref.current.showSelectedElementData(productSelectedData));
        expect(screen.queryByTestId("productHeader")).toBeVisible();
    });

    it("should render side panel for link", () => {
        const ref = createRef();

        const linkExpectedData = {
            "timeline": "от 1998 до 2006",
            "sourceNodeName": "Компания VK",
            "targetNodeName": "Продукт Vkontakte",
            "sourceNodeYear": "1998-10-01T00:00:00Z",
            "targetNodeYear": "2006-09-19T00:00:00Z"
        }

        render(<SidePanel ref={ref} />);
        act(() => ref.current.showSelectedElementType("link"));
        act(() => ref.current.showSelectedElementData(linkExpectedData));
        expect(screen.queryByTestId("linkHeader")).toBeVisible();
    });

});
