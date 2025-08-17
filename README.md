![Pipeline wireframe](pipeline.png)

[Source](https://excalidraw.com/#json=3AEjtpXrUFz5t_D3Sm89C,ZN3-MFPiTu5D0sCDCqB9fg)

## Getting Started

```shell
cp .env.example .env
npm install
npm run db
npm run dev
```
## Routes

### Entities

*TODO:* Really need to have a `/[org]` top-level qualifier. (Or maybe that’s in the domain name?)

* `/`: Unprotected landing page. If logged in, redirect to `/dashboard`.
* `/dashboard`: Landing page
* `/customers`
	* `./[customer]`: Single customer details, including workloads. Link to `GET` `/events/new?customer=[customer]&workload=[workload]` to create a new event
	* `./new`
		* `GET`: Input form
		* `POST`: Create, redirect to `/customers`
		* `./workloads/new`
			* `GET`: Input form
			* `POST`: Create, redirect to `/customers/[customer]`
* `/workloads`
	* `./reports`
		* `./bystage`: Report grouped by stage
		* `./needslove`: Aging report
		* …
	* `?customer`: Filter by multiple customers (OR)
	* `?stage`: Filter by multiple stages (OR)
	* `?size`
* `/events`
	* `?customer`
	* `?workload`
	* `?when=last+7+days`
	* `./[event]`: Detail
	* `./new`
		* \[`?customer`\]
		* \[`?workload`\]
		* \[`?next`\]: Path to return to, e.g. `/customers/[customer]`
		* `GET`: Input form
		* `POST`: Create, redirect to `?next`

### Admin
* `/login`
* `/logout`


## Model

* customers
	* customer 🔑
	* label
	* name
	* *segment*
	* *industry*
	* *region*
* workloads
	* workload 🔑
	* label
	* customer 🔗
* events
	* event 🔑
	* workload 🔗
	* happened_at
	* outcome

## Rebuild Container

```shell
cp .devcontainer/.env.example .devcontainer/.env
```
