import React from 'react';
import Grid from '@material-ui/core/Grid';

interface User {
  id: number | null;
  name: string;
  phone: string;
  address: string;
  is_customer: number;
}

export default function EnterPayment(props: {selectedCustomer: User | null}): JSX.Element {
  return <Grid container />;
}
