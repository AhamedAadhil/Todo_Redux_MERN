import React, { useEffect } from "react";
import NavBar from "../Components/NavBar";
import TodoCard from "../Components/Card";
import { Typography, Grid, Box, Container } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchIncompletedTodos } from "../Redux/Todo";

const Incompleted = () => {
  const todos = useSelector((state) => state.todos.incompletedTodos);
  const loading = useSelector((state) => state.todos.loading);
  const error = useSelector((state) => state.todos.error);

  const jwtToken = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIncompletedTodos(jwtToken));
  }, [dispatch, jwtToken]);

  return (
    <div>
      <NavBar />
      <Box mt={4} px={2}>
        <Container maxWidth="lg">
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography>Error: {error}</Typography>
          ) : (
            <Grid container spacing={2}>
              {todos && todos.length === 0 ? (
                <Typography>
                  No Incompleted notes found for this user!
                </Typography>
              ) : (
                todos.map((todo, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={todo._id}>
                    <TodoCard todo={todo} index={index} />
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </Container>
      </Box>
    </div>
  );
};

export default Incompleted;
