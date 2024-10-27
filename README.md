# pipeline

```shell
psql -d pipeline -U pipelineadmin
```

```shell
npm run dev
```

# Model

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