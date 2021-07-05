import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomePage from "./components/Initial/HomePage";
import BoardPage from "./components/Kanban";
import TaskPage from "./components/Kanban/Task/TaskPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/board/:alias">
          <BoardPage />
        </Route>
        <Route path="/:alias/ticket/:ticketId">
          <TaskPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
