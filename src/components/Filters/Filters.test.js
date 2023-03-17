import React from "react";
import { render, screen, fireEvent, waitForElementToBeRemoved, cleanup, act, waitFor } from '@testing-library/react'
import Filters from './Filters';
import '@testing-library/jest-dom'
import axios from 'axios'
import { configure, shallow, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { SERVER_URL } from '../../constants/globalVariables'

configure({ adapter: new Adapter() });

afterEach(() => {
    cleanup();
});

const whenStable = async () => {
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
};

describe("<Filters />", () => {
    it("should render Filters component", () => {
        let wrapper = shallow(<Filters />);
        expect(wrapper).toMatchSnapshot();
    })

    describe("<Filters /> functionality", () => {
        beforeEach(() => {
            render(<Filters />);
            const iconBtn = screen.getByLabelText(/account of current user/i);
            fireEvent.click(iconBtn);
        });

        it("should open on SettingsButton click", () => {
            expect(screen.getByTestId("dialog")).toBeInTheDocument();
        });

        it("should close on click", async () => {
            expect(screen.getByTestId("dialog")).toBeInTheDocument();
            fireEvent.click(screen.getByTestId("dialog").firstChild);
            await waitForElementToBeRemoved(() => screen.getByTestId("dialog"));
        });

        it("should change dialog title", () => {
            expect(screen.getByTestId("dialog")).toBeInTheDocument();
            fireEvent.click(screen.getByTestId('prodTab'));
            expect(screen.getByTestId("dialogTitle")).toHaveTextContent("Фильтрация продуктов");
        });

        it("should change company name", () => {
            expect(screen.getByTestId("dialog")).toBeInTheDocument();
            const companyNameInput = screen.getByTestId("companyNameInput");
            fireEvent.change(companyNameInput, {
                target: { value: "Ozon" }
            });
            expect(companyNameInput.value).toBe("Ozon");
        });

        it("should change ceo name", () => {
            expect(screen.getByTestId("dialog")).toBeInTheDocument();
            const ceoNameInput = screen.getByTestId("ceoNameInput");
            fireEvent.change(ceoNameInput, {
                target: { value: "Сергей Паньков" }
            });
            expect(ceoNameInput.value).toBe("Сергей Паньков");
        });

        it("should change applied list of departments", async () => {
            expect(screen.getByTestId("dialog")).toBeInTheDocument();
            const selectDepartments = await screen.getByTestId("departmentsSelect");
            const butt = screen.getAllByRole('button')[0];
            fireEvent.mouseDown(butt);
            const listbox = await screen.getByRole('listbox');
        });

        it("should change product name", () => {
            expect(screen.getByTestId("dialog")).toBeInTheDocument();
            fireEvent.click(screen.getByTestId('prodTab'));
            expect(screen.getByTestId("dialogTitle")).toHaveTextContent("Фильтрация продуктов");
            const productNameInput = screen.getByTestId("productNameInput");
            fireEvent.change(productNameInput, {
                target: { value: "Яндекс Браузер" }
            });
            expect(productNameInput.value).toBe("Яндекс Браузер");
        });

        it("should change product verification status", () => {
            expect(screen.getByTestId("dialog")).toBeInTheDocument();
            fireEvent.click(screen.getByTestId('prodTab'));
            expect(screen.getByTestId("dialogTitle")).toHaveTextContent("Фильтрация продуктов");
            const checkboxLabel = "Релиз подтвержден";
            fireEvent.click(screen.getByLabelText(checkboxLabel));
            expect(screen.getByLabelText(checkboxLabel)).toHaveProperty('checked', true)
        });

        it("should change company lifetime", async () => {
            expect(screen.getByTestId("dialog")).toBeInTheDocument();
            const companyLifetimeSlider = screen.getByTestId('compLifeTimeSlider');

            companyLifetimeSlider.getBoundingClientRect = jest.fn(() => ({
                width: 100,
                height: 10,
                bottom: 10,
                left: 0,
                x: 0,
                y: 0,
                right: 0,
                top: 0,
                toJSON: jest.fn(),
            }));

            fireEvent.mouseDown(companyLifetimeSlider, { buttons: 1, clientX: 1996 });
            fireEvent.mouseUp(companyLifetimeSlider, { buttons: 1, clientX: 1996 });
        });

        it("should change company lifetime", async () => {
            expect(screen.getByTestId("dialog")).toBeInTheDocument();
            const companyStateSizeSlider = screen.getByTestId('compStateSizeSlider');

            companyStateSizeSlider.getBoundingClientRect = jest.fn(() => ({
                width: 100,
                height: 10,
                bottom: 10,
                left: 0,
                x: 0,
                y: 0,
                right: 0,
                top: 0,
                toJSON: jest.fn(),
            }));

            fireEvent.mouseDown(companyStateSizeSlider, { buttons: 1, clientX: 15000 });
            fireEvent.mouseUp(companyStateSizeSlider, { buttons: 1, clientX: 15000 });
        });

        it("should change product lifetime", async () => {
            expect(screen.getByTestId("dialog")).toBeInTheDocument();
            fireEvent.click(screen.getByTestId('prodTab'));
            expect(screen.getByTestId("dialogTitle")).toHaveTextContent("Фильтрация продуктов");

            const productLifetimeSlider = screen.getByTestId('prodLifetimeSlider');

            productLifetimeSlider.getBoundingClientRect = jest.fn(() => ({
                width: 100,
                height: 10,
                bottom: 10,
                left: 0,
                x: 0,
                y: 0,
                right: 0,
                top: 0,
                toJSON: jest.fn(),
            }));

            fireEvent.mouseDown(productLifetimeSlider, { buttons: 1, clientX: 1996 });
            fireEvent.mouseUp(productLifetimeSlider, { buttons: 1, clientX: 1996 });
        });
    })

    it("should clear filters on reset button click", () => {
        const clearFilters = jest.fn();
        render(<Filters clearFilters={clearFilters} />);
        const iconBtn = screen.getByLabelText(/account of current user/i);
        fireEvent.click(iconBtn);
        expect(screen.getByTestId("dialog")).toBeInTheDocument();

        const companyNameInput = screen.getByTestId("companyNameInput");
        fireEvent.change(companyNameInput, {
            target: { value: "Ozon" }
        });
        expect(companyNameInput.value).toBe("Ozon");

        const ceoNameInput = screen.getByTestId("ceoNameInput");
        fireEvent.change(ceoNameInput, {
            target: { value: "Сергей Паньков" }
        });
        expect(ceoNameInput.value).toBe("Сергей Паньков");

        fireEvent.click(screen.getByTestId("resetBtn"));
        expect(clearFilters).toHaveBeenCalledTimes(1);
    });

    describe("<Filters /> integration tests", () => {
        it("should fetch correct product filters data after apply button click (minimized graph)", async () => {
            const axiosPostSpy = jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: [42] });
            const changeNodesOpacity = jest.fn();
            render(<Filters changeNodesOpacity={changeNodesOpacity} />);
            await whenStable();

            const iconBtn = screen.getByLabelText(/account of current user/i);
            fireEvent.click(iconBtn);
            expect(screen.getByTestId("dialog")).toBeInTheDocument();

            fireEvent.click(screen.getByTestId('prodTab'));
            expect(screen.getByTestId("dialogTitle")).toHaveTextContent("Фильтрация продуктов");
            const productNameInput = screen.getByTestId("productNameInput");
            fireEvent.change(productNameInput, {
                target: { value: "Ozon.ru" }
            });

            fireEvent.click(screen.getByTestId("applyProdBtn"));
            expect(axiosPostSpy).toBeCalledWith(SERVER_URL + "filterProduct", { "isVerified": false, "maxDate": "2000-01-01T00:00:00Z", "minDate": "1996-01-01T00:00:00Z", "productName": "Ozon.ru" });
            axiosPostSpy.mockRestore();
        });

        it("should fetch correct company filters data from API Server on apply button click (minimized graph)", async () => {
            const axiosPostSpy = jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: [78, 52, 54, 56, 59, 61, 65] });
            const changeNodesOpacity = jest.fn();
            render(<Filters changeNodesOpacity={changeNodesOpacity} />);
            await whenStable();

            const iconBtn = screen.getByLabelText(/account of current user/i);
            fireEvent.click(iconBtn);
            expect(screen.getByTestId("dialog")).toBeInTheDocument();
            expect(screen.getByTestId("dialogTitle")).toHaveTextContent("Фильтрация компаний");

            fireEvent.click(screen.getByTestId("applyCompBtn"));
            expect(axiosPostSpy).toBeCalledWith(SERVER_URL + "filterCompany", {
                "companyName": "",
                "departments": [],
                "ceo": "",
                "minDate": "1980-01-01T00:00:00Z",
                "maxDate": "2000-01-01T00:00:00Z",
                "startStaffSize": 100000,
                "endStaffSize": 400000
            });
            axiosPostSpy.mockRestore();
        });
    });
});
