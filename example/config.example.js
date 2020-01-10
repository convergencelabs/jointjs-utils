//
// This file configures the domain url that is used by all of the exampled to
// connect to the Convergence service.
//

//
// 1. Configure a Convergence server instance. (see https://convergence.io/quickstart/)
//
// 2. Create a domain, not the domain id, and ensure that anonymous authentication is enabled.
//
// 3. Rename this file to config.js and modify the below.
//
// 4. Modify the url to match your convergence username and the domainId of the
//    domain you wish to use.
//

const DOMAIN_URL = "https://localhost:8000/realtime/<convergence-username>/<domain-id>";
