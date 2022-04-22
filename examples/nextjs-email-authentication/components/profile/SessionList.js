import SessionItem from "./SessionListItem";

function SessionList(props) {
  const { sessions } = props;

  return (
    <div className=" border border-gray-200 overflow-x-auto m-auto bg-white min-w-fit rounded-lg">
      <table className=" w-full text-sm  text-white-500">
        <thead className="text-xs uppercase bg-indigo-500 dark:text-gray-100">
          <tr>
            <th className="px-8 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Sign In Date
            </th>
            <th className="px-8 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Browser
            </th>
            <th className="px-8 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Delete
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {sessions.map((session) => (
            <SessionItem key={session.creationDtm} session={session} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SessionList;
