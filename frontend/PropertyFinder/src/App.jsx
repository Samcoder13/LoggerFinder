import Login from "./Components/Login";
import Signup from "./Components/Signup";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Privateroutes from "./Components/Privateroutes";
import Listpage from "./Components/Listpage"; // Fixed import paths
import Bulklisting from "./Components/Bulklisting";
import Logs from "./Components/Logs";
import DetailView from "./Components/DetailView";
import BulkUpload from "./Components/BulkUpload";
import Create from "./Components/Create";
import Edit from "./Components/Edit";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/list" element={<Privateroutes />}>
          <Route path="/list" element={<Listpage />} />
        </Route>
        <Route path="/bulk-listing" element={<Privateroutes />}>
          <Route path="/bulk-listing" element={<Bulklisting />} />
        </Route>
        <Route path="/logs/:uploadId" element={<Privateroutes />}>
          <Route path="/logs/:uploadId" element={<Logs />} />
        </Route>
        <Route path="/view/:Id" element={<Privateroutes />}>
          <Route path="/view/:Id" element={<DetailView />} />
        </Route>
        <Route path="/edit/:Id" element={<Privateroutes />}>
          <Route path="/edit/:Id" element={<Edit />} />
        </Route>
        <Route path="/bulkUpload" element={<Privateroutes />}>
          <Route path="/bulkUpload" element={<BulkUpload />} />
        </Route>
        <Route path="/create" element={<Privateroutes />}>
          <Route path="/create" element={<Create />} />
        </Route>

        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </div>  
  );
}

export default App;
