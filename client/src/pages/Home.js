import React, { useEffect } from "react";
import ResponsiveAppBar from "../Components/NavBar";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodos } from "../Redux/Todo";
import { Typography, Grid, Box, Container } from "@mui/material";
import FloatingActionButtons from "../Components/FAB";
import TodoCard from "../Components/Card";

const Home = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);
  const loading = useSelector((state) => state.todos.loading);
  const error = useSelector((state) => state.todos.error);
  const jwtToken = useSelector((state) => state.user.token);

  useEffect(() => {
    dispatch(fetchTodos(jwtToken));
  }, [dispatch, jwtToken]);

  return (
    <div>
      <ResponsiveAppBar />
      <Box mt={4} px={2}>
        <Container maxWidth="lg">
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography> {error}</Typography>
          ) : (
            <Grid container spacing={2}>
              {todos && todos.length === 0 ? (
                <Typography>No notes found for this user!</Typography>
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
      <FloatingActionButtons />
    </div>
  );
};

export default Home;
