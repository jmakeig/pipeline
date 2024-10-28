# pipeline

## Getting Started 

```shell
npm install
npm run db
npm run dev
```

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