import {GraphQLClient} from "graphql-request";
import {getAccessToken} from "../auth";
import {ApolloClient, InMemoryCache, concat, gql, createHttpLink, ApolloLink} from "@apollo/client";

// const client = new GraphQLClient("http://localhost:9000/graphql", {
//     headers : () => {
//       const token = getAccessToken();
//       if (token) {
//           return {'Authorization': `Bearer ${token}`}
//       }
//       return {};
//     },
// });

const httpLink = createHttpLink({uri: 'http://localhost:9000/graphql'})

const authLink = new ApolloLink((operation, forward) => {
    const token = getAccessToken();
    if (token) {
        operation.setContext({
            headers: {'Authorization': `Bearer ${token}`}
        });
    }
    return forward(operation);
});

const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
    // defaultOptions: {
    //     query: {
    //         fetchPolicy: 'network-only',
    //     },
    //     watchQuery: {
    //         fetchPolicy: 'network-only',
    //     }
    // }
});

const jobDetailFragment = gql`
    fragment JobDetail  on Job {
        id
        title
        date
        description
        company {
            id
            name
        }
    }
`

const jobByIdQuery = gql`
    query JobById($id: ID!) {
        job(id: $id) {
            ...JobDetail
        }
    }
    ${jobDetailFragment}
`;

export async function createJob({title, description}) {
    const mutation = gql`
        mutation CreateJob ($input: CreateJobInput!) {
            job: createJob(input: $input) {
                ...JobDetail
            }
        }
        ${jobDetailFragment}
    `;

    const {data} = await apolloClient.mutate({
        mutation,
        variables: {input: {
        title, description} },
        update: (cache, {data}) => {
            cache.writeQuery({
                query: jobByIdQuery,
                variables: {id: data.job.id},
                data,
            });
        },
    });
    return data.job;
}

export async function updateJob({id, title, description}) {
    const mutation = gql`
        mutation UpdateJob ($input: UpdateJobInput!) {
            job: updateJob(input: $input) {
                id
            }
        }
    `;

    const {data} = await apolloClient.mutate({
         mutation,
         variables: {input: {
         id, title, description} }
    });
    return data.job;
}

export async function deleteJob({id}) {
    const mutation = gql`
        mutation UpdateJob ($id: ID!) {
            job: deleteJob(id: $id) {
                id
            }
        }
    `;

    const {data} = await apolloClient.mutate({
         mutation,
         variables: {id: id}
    });
    return data.job;
}

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
    const {data} = await apolloClient.query({query, fetchPolicy: 'network-only'});
    return data.jobs;
}

export async function getJob(id) {

    const {data} = await apolloClient.query({query: jobByIdQuery, variables: {id}});
    return data.job;
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
    const {data} = await apolloClient.query({query, variables: {companyId}});
    return data.company;
}