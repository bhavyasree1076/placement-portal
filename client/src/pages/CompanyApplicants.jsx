import { useEffect, useState,useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function CompanyApplicants() {
  const { companyId } = useParams();

  const [applications, setApplications] = useState([]);
 
  const fetchApplicants = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://placement-portal-8sbz.onrender.com/api/application/company/${companyId}`
      );

      setApplications(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [companyId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  return (
  <div className="company-applicants-container">

    <h2 className="page-title">
      Company Applicants
    </h2>

    <div className="applicants-grid">

      {applications.map((app) => (
        <div key={app._id} className="applicant-card">

          <h4>{app.studentId?.name}</h4>

          <p>Email: {app.studentId?.email}</p>
          <p>College: {app.studentId?.college}</p>
          <p>Branch: {app.studentId?.branch}</p>
          <p>CGPA: {app.studentId?.cgpa}</p>
          <p>Status: {app.status}</p>

          {app.studentId?.resume && (
            <div>
              <a
                href={`https://placement-portal-8sbz.onrender.com/uploads/${app.studentId.resume}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-info me-2"
              >
                View Resume
              </a>

              <a
                href={`https://placement-portal-8sbz.onrender.com/uploads/${app.studentId.resume}`}
                download
                className="btn btn-success"
              >
                Download Resume
              </a>
            </div>
          )}

        </div>
      ))}

    </div>
  </div>
);
}

export default CompanyApplicants;