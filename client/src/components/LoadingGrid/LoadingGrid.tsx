import React from "react";
import { Center, Grid, Loader } from "@mantine/core";

export default function LoadingGrid() {
  return (
    <Grid columns={12}>
      <Grid.Col span={12}>
        <Center>
          <Loader />
        </Center>
      </Grid.Col>
    </Grid>
  );
}
