import { value, } from 'vue-function-api'

type primitive = string | boolean | number

export type IncludeDirective = Array<string | NestedInclude> | string | NestedInclude

type NestedInclude = {
  [key: string]: IncludeDirective
}

export type WhereClause<Resource> = Partial<{
  [key in keyof Resource]: WhereCondition<key, Resource>;
}>

type WhereLeaf<T extends primitive> = T | {
  [key: string]: T
}

type WhereCondition<Key extends keyof Resource, Resource, T = Resource[Key]> =
  T extends primitive ? WhereLeaf<T> : WhereClause<T>

export type Sort<Resource> = {
  [key: string]: 'asc' | 'desc'
}

export type GraphitiQuery<Resource> = {
  where?: WhereClause<Resource>,
  include?: IncludeDirective
  sort?: Sort<Resource>,
  stats: Record<string, any>
}

export type GraphitiListQuery<Resource> = GraphitiQuery<Resource> & {
  page?: number
  perPage?: number
}

export function buildClient<T>() {
  let wade = { id: '1', first_name: 'Wade', last_name: 'Tandy', age: 32 }
  let lee = { id: '2', first_name: 'Lee', last_name: 'Richmond', age: 35 }

  return {
    query<
      JsonapiType extends keyof T,
      Filters extends T[JsonapiType] = T[JsonapiType],
      Scope extends GraphitiListQuery<Filters> = GraphitiListQuery<Filters>
    >(type: JsonapiType, scope: Scope) {
      const results = value([] as Array<T[JsonapiType]>)
      const loading = value(true)
      const resultsMeta = value({} as Record<string, any>)

      function loadResults() {
        setTimeout(() => {
          results.value = [
            wade,
            lee
          ] as any

          resultsMeta.value = {
            stats: {
              total: 1
            }
          }

          loading.value = false
        }, 250);
      }

      function updateScope(newScope: Scope) {
        scope = newScope

        loading.value = true
        loadResults()
      }

      loadResults()

      return {
        results,
        resultsMeta,
        loading,
        updateScope
      }
    },

    loadSingleRecord<
      JsonapiType extends keyof T,
      Filters extends T[JsonapiType] = T[JsonapiType],
      Scope extends GraphitiListQuery<Filters> = GraphitiListQuery<Filters>
    >(type: JsonapiType, id: string, options?: { scope?: Scope }) {
      const record = value(undefined as T[JsonapiType] | undefined)
      const loading = value(true)

      let lee = { id: '2', first_name: 'Lee', last_name: 'Richmond', age: 35 }

      function loadRecord(id: string) {
        setTimeout(() => {
          record.value = lee as any
          loading.value = false
        }, 250);
      }

      loadRecord(id)

      return {
        record,
        loading,
        loadRecord,
      }
    }
  }
}
