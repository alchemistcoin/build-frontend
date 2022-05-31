import fetch from "node-fetch";

const handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed.',
            headers: {
                'Access-Control-Allow-Origin': '*',
                Allow: 'GET'
            }
        };
    }

    const { repo } = event.queryStringParameters;

    try {
        let issues;

        if (repo) {

            const issueRes = await fetch(`https://api.github.com/repos/${repo}/issues`, {
                headers: {
                    Authorization: 'token '+process.env.GITHUB_TOKEN,
                },
            });

            issues = await issueRes.json();

        } else {

            const res = await fetch('https://api.github.com/orgs/alchemistcoin/repos?sort=updated', {
                headers: {
                    Authorization: 'token '+process.env.GITHUB_TOKEN,
                },
            });

            issues = await res.json();

        }

        return {
            statusCode: 200,
            body: issues,
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        };
    } catch (error) {
        console.log('error', error);
        return {
            statusCode: 400,
            statusMessage: JSON.stringify(error),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        };
    }
};

module.exports = { handler };
