## gcloud

* `gcloud config set project google.com:cloud-spanner-demo`
* `gcloud auth application-default login`

## Design

### `/customers`
* `GET /`: All customers
	* `?by`: Filter
	* `POST`: Add new customer. Redirects to `GET /[id]` or `GET /new` on validation error.
* `GET /[id]`: View a customer
	* `?edit`: Edit view.
* `/new`: New customer entry (view shared with `/[id]?edit`)
* `PUT /[id]`: Update a customer.
* `DELETE /?ids=` or `DELETE /?labels=`
* `DELETE /[id]`: Deletes a customer.
