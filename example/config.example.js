//
// This file configures the domain url that is used by all of the exampled to
// connect to the Convergence service.
//

//
// 1. Configure a Convergence server instance. (see https://convergence.io/quickstart/)
//
// 2. Create a domain, note the domain id, and ensure that anonymous authentication is enabled.
//
// 3. Rename this file to config.js and modify the below.
//
// 4. Modify the url to match your convergence namespace and the domainId of the
//    domain you wish to use.
//

const DOMAIN_URL = "http://localhost:8000/api/realtime/convergence/default";
