import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/formatters';
import { useJob } from "../lib/graphql/hooks";

function JobPage() {
  const { jobId } = useParams();

  const {loading, job, error} = useJob(jobId);

  if (loading) {
      return <div>Loading...</div>
  }

  if (error) {
      return <div className="has-text-danger">Data Unavailable.</div>;
  }

  return (
    <div>
      <h1 className="title is-2">
        {job.title}
      </h1>
      <h2 className="subtitle is-4">
        <Link to={`/companies/${job.company.id}`}>
          {job.company.name}
        </Link>
      </h2>
      <div className="box">
        <div className="block has-text-grey">
          Posted: {formatDate(job.date, 'long')}
        </div>
        <p className="block">
          {job.description}
        </p>
      </div>
      <button className="button">Update</button>
    </div>
  );
}

export default JobPage;
