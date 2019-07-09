<template>
  <div class="card query">
    <h3>Query</h3>
    <div class='search-controls'>
      <form v-on:submit.prevent="search()">
        <div class="row">
          <div class="col-md-6">
            <div class='form-group'>
              <input v-model="scope.first_name.prefix" type='search' class='form-control' placeholder="First Name" />
            </div>
            <div class='form-group'>
              <input v-model="scope.last_name.prefix" type='search' class='form-control' placeholder="Last Name" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="clearfix">
              <button class="btn btn-lg btn-primary float-right" type="submit">Search</button>
            </div>

            <div class="meta">
              <div class="float-right pagination">
                <a v-if="hasPrevPage" @click="paginate(true)">&laquo; Prev</a>
                <a v-if="hasNextPage" @click="paginate()">Next &raquo;</a>
              </div>

              <span class="float-right total">Total: {{totalCount}}</span>
            </div>
          </div>
        </div>
      </form>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th><a @click="doSort('last_name')">Name</a></th>
          <th><a @click="doSort('age')">Age</a></th>
          <th><a @click="doSort('title')">Position</a></th>
          <th><a @click="doSort('department_name')">Department</a></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="employee in employees" :key="employee.id">
          <td>
            <a @click="selectEmployee(employee)">
              {{ employee.last_name }}, {{ employee.first_name }}
            </a>
          </td>
          <td>{{ employee.age }}</td>
          <td>Position title</td>
          <td>Department Name</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// import { Employee } from "@/models"
// import { Scope, WhereClause, SortScope } from "spraypaint"
import EventBus from "@/event-bus"

import { onCreated, computed, value } from 'vue-function-api'

import { WhereClause, IncludeDirective, Sort, GraphitiListQuery } from '../hooks'
import { Employee, Position, employeeDirectoryApi } from '../api/employee-directory'


export default Vue.extend({
  name: 'query',
  setup() {
    const initialScope : WhereClause<Employee> = {
      first_name: {
        prefix: ''
      },
      last_name: {
        prefix: ''
      },
    }

    const initialSort : Sort<Employee>= {
      created_at: 'desc'
    }

    const currentPage = value(1)
    const scope = value(initialScope)
    const sort = value(initialSort)

    const query = computed(() : GraphitiListQuery<Employee> => {
      return {
        where: scope.value,
        sort: sort.value,
        stats: {
          total: 'count'
        },
        include: {
          current_position: "department"
        },
        page: currentPage.value,
        perPage: 10
      }
    })

    const {
      results: employees,
      resultsMeta,
      loading,
      updateScope,
    } = employeeDirectoryApi.query('employees', query.value)

    const totalCount = computed(() => {
      if (resultsMeta.value && resultsMeta.value.total) {
        return resultsMeta.value.stats.total.count
      } else {
        return undefined
      }
    })

    const search = async () => {
      updateScope(query.value)
    }

    const doSort = (attribute: string) => {
      if (sort.value[attribute] && sort.value[attribute] === "desc") {
        sort.value = {[attribute]: "asc"}
      } else {
        sort.value = {[attribute]: "desc"}
      }

      search()
    }

    const paginate = (back: boolean = false) => {
      let count = 1
      if (back) count = -1
      currentPage.value += count

      search()
    }

    const selectEmployee = (employee: Employee): void => {
      EventBus.$emit('employee_selected', employee.id)
    }

    onCreated(() => {
      EventBus.$on('employee_save', (employee: Employee) => {
        search()
      })
    })

    return {
      employees,
      sort,
      totalCount,
      currentPage,
      query,
      scope,
      hasPrevPage: computed(() => {
        return currentPage.value > 1
      }),
      hasNextPage: computed(() => {
        return (currentPage.value * 10) < (totalCount.value || 0)
      }),
      search,
      doSort,
      paginate,
      selectEmployee
    }
  }
});
</script>

<style lang="scss" scoped>
.meta {
  margin-top: 0.5rem;
}

table tbody td a {
  color: #007bff !important;
  cursor: pointer;
}

.pagination {
  margin-left: 1rem;

  a {
    &:hover {
      color: darken(#90CAF9, 20%);
    }

    &:nth-child(2) {
      margin-left: 0.5rem;
    }
  }
}
</style>