import React from 'react';
import { useHistory } from 'react-router';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

export default function BackButton() : JSX.Element {
  const history = useHistory();

  return (
    <Grid>
      <Button
        variant="contained"
        color="primary"
        style={{margin: 10}}
        onClick={() => history.goBack()}
      >
        Back
      </Button>
    </Grid>

  );
}
