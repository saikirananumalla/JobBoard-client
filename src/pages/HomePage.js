import JobList from '../components/JobList';
import {useJobs} from "../lib/graphql/hooks";
import {useState} from "react";
import PaginationBar from "../components/PaginationBar";

const JOBS_PER_PAGE = 5;

function HomePage() {
  const [curPage, setCurPage] = useState(1);

  const {loading, error, jobs} = useJobs(
      JOBS_PER_PAGE, (curPage-1)*JOBS_PER_PAGE);

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div className="has-text-danger">Data Unavailable.</div>;
    }

    const jTotal = jobs.totalCount;
    const totalPages = Math.ceil(jTotal / JOBS_PER_PAGE);

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <PaginationBar currentPage={curPage} totalPages={totalPages}
            onPageChange={setCurPage}
      />
      <JobList jobs={jobs.items} />
    </div>
  );
}

export default HomePage;
