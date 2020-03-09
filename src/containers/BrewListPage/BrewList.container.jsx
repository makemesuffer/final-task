import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import BrewList from "../../components/BrewListPage/BrewList";
import {
  getBrewList,
  getRatingChange,
  getFilteredBrews,
  getFilteredTime
} from "../../store/brew/actions";

class BrewListContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: ["Day", "Week", "Month", "Year", "All"],
      beerType: [
        "All",
        "Ale",
        "Lager",
        "Stout",
        "Porter",
        "Lambic",
        "Pilsner",
        "Pale Ale",
        "Weissbier",
        "Belgian Ale"
      ],
      brewType: "All",
      whatTime: "Day",
      rating: []
    };
  }

  componentDidMount() {
    const waitBrewList = async () => {
      await this.props.getBrewList();
      const { brewList } = this.props;
      const count = brewList.map(brew => {
        return brew.rating;
      });
      this.setState({ rating: count });
    };
    waitBrewList();
  }

  handleTypeChange = (e, values) => {
    if (values === null) {
      this.setState({ brewType: "All" });
    }
    if (values !== undefined && values !== null) {
      this.setState({ brewType: values });
    }
  };

  handleTimeChange = (e, values) => {
    if (values !== undefined && values !== null) {
      this.setState({ whatTime: values });
    }
  };

  handleFilter = async () => {
    const { brewType, whatTime } = this.state;
    await this.props.getFilteredBrews({ brewType });
    const { brewList } = this.props;
    this.props.getFilteredTime(whatTime, brewList);
    const { brewList: newBrewList } = this.props;
    const count = newBrewList.map(brew => {
      return brew.rating;
    });
    this.setState({ rating: count });
  };

  handleRating = async (decision, index) => {
    const { user, brewList } = this.props;
    const { rating: rate } = this.state;
    if (user !== null) {
      const payload = { userId: user.id, id: brewList[index]._id };
      const copy = [...rate];
      await this.props.getRatingChange(decision, payload);
      const { rating } = this.props;
      copy[index] = rating;
      this.setState({ rating: copy });
    }
  };

  render() {
    const { allowed, brewList, error, id } = this.props;
    const { time, beerType, rating, brewType, whatTime } = this.state;
    return (
      <>
        <BrewList
          error={error}
          allowed={allowed}
          rating={rating}
          brewList={brewList}
          time={time}
          beerType={beerType}
          handleRating={this.handleRating}
          id={id}
          handleTypeChange={this.handleTypeChange}
          handleTimeChange={this.handleTimeChange}
          handleFilter={this.handleFilter}
          whatTime={whatTime}
          brewType={brewType}
        />
      </>
    );
  }
}

BrewListContainer.propTypes = {
  error: PropTypes.string,
  allowed: PropTypes.bool.isRequired,
  brewList: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.objectOf(PropTypes.any),
  getBrewList: PropTypes.func.isRequired,
  getRatingChange: PropTypes.func.isRequired,
  rating: PropTypes.number.isRequired,
  id: PropTypes.string,
  getFilteredBrews: PropTypes.func.isRequired,
  getFilteredTime: PropTypes.func.isRequired
};

BrewListContainer.defaultProps = {
  brewList: null,
  user: null,
  error: null,
  id: null
};

const mapStateToProps = state => {
  return {
    allowed: state.user.allowed,
    user: state.user.user,
    brewList: state.brew.brewList,
    rating: state.brew.rating,
    error: state.brew.error,
    id: state.brew.id
  };
};

export default connect(mapStateToProps, {
  getBrewList,
  getRatingChange,
  getFilteredBrews,
  getFilteredTime
})(BrewListContainer);
