import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import BrewInput from "./BrewInput";
import BrewPreview from "./BrewPreview";

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(8)
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "0.7fr 1.3fr",
    textAlign: "center",
    gridColumnGap: 20
  }
}));

export default function BrewForm(props) {
  const {
    beerNames,
    handleChange,
    handleMapClick,
    location,
    photos,
    handleUpload,
    beerTypes,
    handleSubmit
  } = props;

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xl" className={classes.container}>
      <Paper className={classes.grid}>
        <BrewInput
          handleUpload={handleUpload}
          location={location}
          beerNames={beerNames}
          handleChange={handleChange}
          handleMapClick={handleMapClick}
          photos={photos}
          beerTypes={beerTypes}
          handleSubmit={handleSubmit}
        />
        <BrewPreview />
      </Paper>
    </Container>
  );
}

BrewForm.propTypes = {
  beerNames: PropTypes.arrayOf(PropTypes.object),
  handleChange: PropTypes.func.isRequired,
  handleMapClick: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  photos: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleUpload: PropTypes.func.isRequired,
  beerTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSubmit: PropTypes.func.isRequired
};

BrewForm.defaultProps = {
  beerNames: []
};
