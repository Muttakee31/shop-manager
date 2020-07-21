import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

function getSteps() {
  return ['Select campaign settings', 'Create an ad group', 'Create an ad'];
}


export default function StepperComponent(props: {orderState:number}) {
  const classes = useStyles();
  const steps = getSteps();


  return (
    <div className={classes.root}>
    <Stepper activeStep={props.orderState}>
    {steps.map((label) => {
        const stepProps: { completed?: boolean } = {};
        const labelProps: { optional?: React.ReactNode } = {};
        return (
          <Step key={label} {...stepProps}>
        <StepLabel {...labelProps}>{label}</StepLabel>
        </Step>
      );
      })}
    </Stepper>
    <div>
  </div>
  </div>
);
}
