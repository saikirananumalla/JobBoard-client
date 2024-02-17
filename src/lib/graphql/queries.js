import {GraphQLClient, gql} from "graphql-request";

const client = new GraphQLClient("http://localhost:9000/graphql");

export async function getJobs() {
    const query = gql`
        query Jobs {
            jobs {
                id
                date
                title
                company {
                    id
                    name
                }
            }
        }
    `;
    const {jobs} = await client.request(query);
    return jobs;
}

export async function getJob(id) {
    const query = gql`
        query JobById($id: ID!) {
            job(id: $id) {
                id
                title
                date
                description
                company {
                    id
                    name
                }
            }
        }
    `;
    const {job} = await client.request(query, {id});
    return job;
}

export async function getCompany(companyId){
    const query = gql`
        query Company($companyId: ID!) {
            company(id: $companyId) {
                id
                name
                description
                jobs {
                    id
                    date
                    title
                }
            }
        }
    `;
    const {company} = await client.request(query, {companyId});
    return company;
}