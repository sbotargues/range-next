import React, { Component } from "react";
import Link from "next/link";
import { Range } from "../components/Range";
import { ApiService } from "../api/api";

interface RangeData {
  id: string;
  min: number;
  max: number;
  rangeValues: number[] | undefined;
}

interface Exercise2State {
  data: RangeData[];
}

export default class Exercise2 extends Component<{}, Exercise2State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  onChangeMin = (value: number, id: string) => {
    const store = [...this.state.data];
    const index = store.findIndex((range) => range.id === id);
    store[index].min = value;
    this.setState({
      data: store,
    });
  };

  onChangeMax = (value: number, id: string) => {
    const store = [...this.state.data];
    const index = store.findIndex((range) => range.id === id);
    store[index].max = value;
    this.setState({
      data: store,
    });
  };

  async fetchData() {
    const data = await ApiService.getAllFixedRanges();
    this.setState({ data });
  }

  render() {
    const { data } = this.state;
    return (
      <div className="flex flex-col items-center my-8">
        <div className="mb-8">
          <Link href="/">
            <span className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out cursor-pointer">
              Back to Home
            </span>
          </Link>
        </div>
        <ul className="list-ranges space-y-4 max-w-4xl w-full">
          {data.map((range) => (
            <li key={range.id} className="bg-white shadow-md rounded-lg p-4">
              <Range
                id={range.id}
                min={range.min}
                max={range.max}
                rangeValues={range.rangeValues}
                onChangeMin={this.onChangeMin}
                onChangeMax={this.onChangeMax}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
