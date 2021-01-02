import React from 'react';
import { useHistory } from 'react-router';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

export default function BackButton({customGoBack}) : JSX.Element {
  const history = useHistory();

  return (
    <Grid>
      <Button
        variant="contained"
        color="primary"
        style={{margin: 10}}
        onClick={() => customGoBack ? customGoBack() : history.goBack()}
      >
        Back
      </Button>
    </Grid>

  );
}
