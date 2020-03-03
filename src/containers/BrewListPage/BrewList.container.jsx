import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import BrewList from "../../components/BrewListPage/BrewList";
import { getUser } from "../../store/user/actions";
import { getBrewList } from "../../store/brew/actions";
import { dislikePost, likePost } from "../../dataAccess/brewRepository/helpers";

class BrewListContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: ["day", "week", "month", "year", "all"],
      beerType: [
        "Ale",
        "Lager",
        "Stout",
        "Porter",
        "Lambic",
        "Pilsner",
        "Pale Ale",
        "Weissbier",
        "Belgian Ale"
      ]
    };
  }

  componentDidMount() {
    const { user } = this.props;
    const waitUser = async () => {
      await this.props.getUser(user.id);
    };
    waitUser();
    const waitBrewList = async () => {
      await this.props.getBrewList();
    };
    waitBrewList();
  }

  handleRating = async (decision, index) => {
    const { user, brewList } = this.props;
    const payload = { userId: user.id, id: brewList[index]._id };
    const response =
      decision === "+" ? await likePost(payload) : await dislikePost(payload);

    console.log(response.data);
  };

  render() {
    const { allowed, brewList } = this.props;
    const { time, beerType } = this.state;
    return (
      <>
        <BrewList
          allowed={allowed}
          brewList={brewList}
          time={time}
          beerType={beerType}
          handleRating={this.handleRating}
        />
      </>
    );
  }
}

BrewListContainer.propTypes = {
  allowed: PropTypes.bool.isRequired,
  brewList: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.objectOf(PropTypes.any),
  getUser: PropTypes.func.isRequired,
  getBrewList: PropTypes.func.isRequired
};

BrewListContainer.defaultProps = {
  brewList: null,
  user: null
};

const mapStateToProps = state => {
  return {
    allowed: state.user.allowed,
    user: state.user.user,
    brewList: state.brew.brewList
  };
};

export default connect(mapStateToProps, { getUser, getBrewList })(
  BrewListContainer
);
