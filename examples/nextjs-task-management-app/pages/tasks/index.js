import { altogic } from "../../helpers/altogic";
import { checkCookies, getCookie, removeCookies } from "cookies-next";
import TaskView from "../../components/tasks/TasksView";
import Analytics from "../../components/tasks/Analytics";
import { TaskContext } from "../../context/taskContext";
import { useContext } from "react";

function Tasks() {
  const context = useContext(TaskContext);
  const handleChangeProject = (event) => {
    context.setCurrentProject(JSON.parse(event.target.value));
  };
  return (
    <div className="grid lg:grid-cols-12 grid-cols-6 bg-slate-100">
      <div className="md:col-span-7 lg:col-span-9 hidden sm:block">
        <TaskView />
      </div>
      <div className="md:col-span-3 lg:col-span-3 hidden sm:block">
        <Analytics />
      </div>
      <div className="md:hidden lg:hidden col-span-12 bg-slate-100 p-3">
        <TaskView />
        <Analytics />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  let result;
  let tokenFromCookie;
  if (checkCookies("token", { req, res })) {
    // Check if there is a token between the browser and the server.
    // Get the cookie.
    // Set the session for Altogic's built in fetcher so we can send requests.
    // Get the current user from database.
    tokenFromCookie = getCookie("token", { req, res });
    altogic.auth.setSession({ token: tokenFromCookie });
    result = await altogic.auth.getUserFromDB();
  } else {
    return {
      //If there is no token, redirect to sign-in page.
      redirect: { destination: "/auth/sign-in", permanent: false },
    };
  }
  if (result.user) {
    //If a user is returned from database, pass it as props.
    return {
      props: { user: result.user, cookies: req.cookies },
    };
  } else {
    //If token is not active anymore, remove the cookie and redirect to sign-in page.
    removeCookies("token", {
      req,
      res,
      sameSite: "none",
      httpOnly: true,
      secure: true,
    });
    return {
      redirect: { destination: "/auth/sign-in", permanent: false },
    };
  }
}

export default Tasks;
