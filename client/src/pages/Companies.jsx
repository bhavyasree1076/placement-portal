import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [, setApplicantCounts] =useState({});

const fetchApplicantCounts =
  async (companiesData) => {
    const counts = {};

    for (const company of companiesData) {
      try {
        const res = await axios.get(
          `https://placement-portal-8sbz.onrender.com/api/application/company-count/${company._id}`
        );

        counts[company._id] =
          res.data.count;
      } catch (error) {
        counts[company._id] = 0;
      }
    }

    setApplicantCounts(counts);
  };
  const fetchCompanies = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://placement-portal-8sbz.onrender.com/api/company/all"
      );

      setCompanies(res.data);
      fetchApplicantCounts(
  res.data
);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
  fetchCompanies();
}, [fetchCompanies]);

  const applyJob = async (company) => {
      if (company.status === "Closed") {
      toast.error(
        "This company is closed"
      );
      return;
    }

    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const profile = await axios.get(
        `https://placement-portal-8sbz.onrender.com/api/user/${user.id}`
      );

      const studentCGPA = Number(
        profile.data.cgpa
      );

      const requiredCGPA = Number(
        company.minCGPA || 0
      );

      if (studentCGPA < requiredCGPA) {
        toast.error(
          `Minimum CGPA required is ${requiredCGPA}`
        );
        return;
        
      }
      const today = new Date();

const deadline = new Date(
  company.deadline
);

if (
  company.deadline &&
  today > deadline
) {
  toast.error(
    "Application deadline has passed"
  );
  return;
}

      const res = await axios.post(
        "https://placement-portal-8sbz.onrender.com/api/application/apply",
        {
          studentId: user.id,
          companyId: company._id,
        }
      );

      toast.success(res.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Application Failed"
      );
    }
  };

  const deleteCompany = async (id) => {
    try {
      await axios.delete(
        `https://placement-portal-8sbz.onrender.com/api/company/${id}`
      );

      toast.success("Company Deleted");

      fetchCompanies();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const editCompany = async (company) => {
    const companyName = prompt(
      "Enter Company Name",
      company.companyName
    );

    const role = prompt(
      "Enter Role",
      company.role
    );

    const location = prompt(
      "Enter Location",
      company.location
    );

    const packageValue = prompt(
      "Enter Package",
      company.package
    );

    try {
      await axios.put(
        `https://placement-portal-8sbz.onrender.com/api/company/${company._id}`,
        {
          companyName,
          role,
          location,
          package: packageValue,
        }
      );

      toast.success("Company Updated");

      fetchCompanies();
    } catch (error) {
      toast.error("Update Failed");
    }
  };
   
  const toggleStatus = async (
  company
) => {
  try {
    await axios.put(
      `https://placement-portal-8sbz.onrender.com/api/company/${company._id}`,
      {
        status:
          company.status === "Open"
            ? "Closed"
            : "Open",
      }
    );

    toast.success(
      "Company Status Updated"
    );

    fetchCompanies();
  } catch (error) {
    toast.error("Update Failed");
  }
};
  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2>Available Companies</h2>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search Company..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          className="form-control mb-3"
          value={locationFilter}
          onChange={(e) =>
            setLocationFilter(e.target.value)
          }
        >
          <option value="">
            All Locations
          </option>
          <option value="Hyderabad">
            Hyderabad
          </option>
          <option value="Bangalore">
            Bangalore
          </option>
          <option value="Chennai">
            Chennai
          </option>
        </select>

        {companies
          .filter((company) => {
            const matchesSearch =
              (company.companyName || "")
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                );

            const matchesLocation =
              locationFilter === "" ||
              company.location ===
                locationFilter;

            return (
              matchesSearch &&
              matchesLocation
            );
          })
          .map((company) => (
            <div
              key={company._id}
              className="card p-3 mb-3"
            >
              <h3>
                {company.companyName}
              </h3>
             <p>
  Status:
  <strong>
    {" "}
    {company.status || "Open"}
  </strong>
</p> 
              <p>
                Role: {company.role}
              </p>

              <p>
                Package: {company.package}
              </p>

              <p>
                Minimum CGPA:{" "}
                {company.minCGPA || 0}
              </p>
               
               <p>
  Last Date:
  {" "}
  {company.deadline
    ? new Date(
        company.deadline
      ).toLocaleDateString()
    : "N/A"}
</p>
              <p>
                Location:{" "}
                {company.location}
              </p>
              
              <p>
                {company.description}
              </p>

              <div>
                {localStorage.getItem("role") === "student" && (
  <button
    className="btn btn-success me-2"
    disabled={
      company.status === "Closed" ||
      (company.deadline &&
        new Date() >
          new Date(company.deadline))
    }
    onClick={() =>
      applyJob(company)
    }
  >
    {company.status === "Closed"
      ? "Company Closed"
      : company.deadline &&
        new Date() >
          new Date(company.deadline)
      ? "Applications Closed"
      : "Apply"}
  </button>
)}
                {localStorage.getItem(
                  "role"
                ) === "admin" && (
                  <>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() =>
                        editCompany(company)
                      }
                    >
                      Edit
                    </button>
                    <button
  className="btn btn-secondary me-2"
  onClick={() =>
    toggleStatus(company)
  }
>
  {company.status === "Open"
    ? "Close Company"
    : "Open Company"}
</button>

                    <button
                      className="btn btn-danger me-2"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Delete this company?"
                          )
                        ) {
                          deleteCompany(
                            company._id
                          );
                        }
                      }}
                    >
                      Delete
                    </button>

                    <Link
                      to={`/company-applicants/${company._id}`}
                      className="btn btn-secondary"
                    >
                      Applicants
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default Companies;