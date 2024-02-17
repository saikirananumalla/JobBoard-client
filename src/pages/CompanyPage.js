import { useParams } from 'react-router';
import {useEffect, useState} from "react";
import {getCompany} from "../lib/graphql/queries";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();

    const [state, setState] = useState({
         company:null,
         loading: true,
         error: false,
    });

    useEffect(() => {
        (async () => {
            try {
                const company = await getCompany(companyId);
                setState({company: company, loading: false, error: false});
            } catch {
                setState({company: null, loading: false, error: true});
            }
        })();

    }, [companyId]);


  const {company, loading, error} = state;

  if (loading) {
      return <div>Loading...</div>;
  }

  if (error) {
      return <div className="has-text-danger">Data Unavailable.</div>;
  }

  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2 className="title is-5">
          Jobs at {company.name}
      </h2>
      <JobList jobs = {company.jobs} />
    </div>
  );
}

export default CompanyPage;
