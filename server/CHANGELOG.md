# Changelog (weaverbird python package)

## Unreleased

## [0.41.0] - 2023-12-27

### Added

- It is now possible to use variables in a `RelativeDateCondition` when instantiating a `FilterStepWithVariables`

## [0.40.2] - 2023-12-21

### Fixed

- Fixed a performance issue in a `PipelineStep{WithRefs,}OrDomainName` validator which is used to
  mitigate some issues with recursive tagged unions in Pydantic v2

## [0.40.1] - 2023-12-19

### Fixed

- `remove_void_conditions_from_filter_steps` now properly recurses into `append` and `join` steps.

## [0.40.0] - 2023-12-15

### Breaking

- Dropped support for Python 3.10
- Bumped `pydantic` minimum version from 1.x to 2.4.2

## [0.39.0] - 2023-10-16

### Added

- Pypika translator: added an optional `columns` property to CustomSQL step. This column list is used when translating
  the query, and avoid relying on a fake table in `table_columns`. This prevents name conflicts when joining multiple
  pipelines with different CustomSQL steps.

## [0.38.1] - 2023-10-13

### Fixed

- Waterfall step: Instead of having both milestones last, the first milestone is now the first element
  and the last one is last.

## [0.38.0] - 2023-10-06

### Added

- Waterfall step: Added a `backfill` option defaulting to true. In case `backfill` is specified, missing start or end rows are
  backfilled. In case `backfill` is false, elements with a missing start or end row are filtered out and not taken into account
  for calculations.

### Fixed

- Waterfall step: Mongo and pandas results are now identical. This includes:
    - `parent` and `child` are now lowercase for both backends
    - The row order is now always children, parents, milestones
    - In case no backfill is specified, rows without a start or end value are not taken into account anymore. (see `Added`
    section for details)

## [0.37.2] - 2023-09-26

### Fixed

- `pytest-asyncio` is no longer a dependency


## [0.37.1] - 2023-09-08

### Fixed

- Pypika: the `evolution` step now casts the value column to a floating point type before calculating a percentage
- Pypika: the `datetextract` step now returns the first day of the previous month rather than the first day of the previous year
  for `firstDayOfPreviousMonth`.

## [0.37.0] - 2023-09-07

### Changed

- Pypika: Added support for the `duration` step

### Fixed

- Pandas: The `rank` step now preserves the original order of rows when sorting by rank

## [0.36.2] - 2023-08-31

### Fixed

- PyPika: The `fromdate` step now has consistent formatting between all backends
- PyPika: Postgres full months are no longer padded to 9 chars
- PyPika: Added support for `fromdate` to Athena and Google Big Query backends

## [0.36.1] - 2023-08-22

### Fixed

- `remove_void_conditions_from_mongo_steps` now only applies to `$match` steps

## [0.36.0] - 2023-08-21

### Changed

- Pypika: The `percentage` step now returns a value between 0 and 1 to be consistent with the mongo and pandas backends

## [0.35.5] - 2023-08-17

### Fixed

- `remove_void_conditions_from_mongo_steps` now preserves falsy values in queries, such as `None`, `{}` or `[]`

## [0.35.4] - 2023-08-11

### Fixed

- Fix[PyPika]: `ifthenelse` step supports numerical values

## [0.35.3] - 2023-08-10

### Fixed

- Fix[PyPika]: adapt custom date formats for SQL engines.

## [0.35.2] - 2023-08-08

### Fixed

- Pypika: Added support for the `percentage` step
- Fix[PyPika]: escape properly column names on GBQ

## [0.35.1] - 2023-08-01

### Fixed

- Fix[PyPika]: fix aggregate step when there is no `step.on`

## [0.35.0] - 2023-07-27

### Fixed

- Mongo: Fixed an issue with the `join` step when the columns to join on contained illegal characters.
- The `rank` step is now supported by the pypika translator

## [0.34.1] - 2023-07-25

### Fixed

- Fix[Mongo]: Keep empty list from mongo pipeline after  `weaverbird.pipeline.remove_void_conditions_from_mongo_steps()`
  to keep steps that depends on those characteristics to still working.

## [0.34.0] - 2023-07-10

### Changed

- References can now be unresolved (None). Append steps can skip unresolved references, while Join and Domain steps
  raises an error `ReferenceUnresolved`.

## [0.33.2] - 2023-07-07

### Fixed

- Fix[Mongo]: Ignore in the mongo rank step some specific keys that define it and should be considered as 'None'.

## [0.33.1] - 2023-07-07

### Fixed

- Fix[Mongo]: Add case insensitive on `matches/notmatches` mongo filter step.
- Fix[Mongo]: ignore `$ne` and `$eq` when removing `__VOID__` values from a mongo pipeline to keep mongo filter steps for `isnull` and `isnotnull`.

## [0.33.0] - 2023-06-29

### Changed

- Support if pipeline references has moved form UI to server.
  This means the front-end does not need to know all the available pipelines contents anymore (only their name/uids).
  Introduce the model `PipelineWithRefs`, and its method `resolve_references`.

## [0.32.0] - 2023-06-16

- `__VOID__` values can now be removed from mongo queries with `weaverbird.pipeline.remove_void_conditions_from_mongo_steps()`.
- PyPika: In case the second step of a pipeline is a Filter or a Top step, it gets merged with the first step
  if it is a Domain step. This ensures that the SQl engine works on as few rows as possible as soon as possible.

## [0.31.1] - 2023-06-06

- Pypika: Fixed the integer cast for "integer date parts" columns for dateextract step.

## [0.31.0] - 2023-05-30

- Now we can clean filter steps containing `__VOID__` as values in conditions with `pipeline.remove_void_conditions_from_filter_steps()`.
- Pandas: Fixed the integer cast for "integer date parts" columns for dateextract step.

## [0.30.1] - 2023-05-24

- PyPika: Fixed a bug by quoting column names in `PARTITION BY "column"`

## [0.30.0] - 2023-04-28

- This release officially adds support for Python 3.11.

## [0.29.1] - 2023-03-09

- Fixed a few typing annotations for Python 3.11 compatibility.

## [0.29.0] - 2023-03-08

- The upper constraint on Python < 3.11 has been lifted. **This does not mean that Python 3.11 is officially supported yet**.
- The only dependency is now pydantic. pandas/pypika-related dependencies have been moved to the `pandas` and `pypika` extras.
  An `all` extra is also available, and will install all previously required dependencies.

## [0.28.2] - 2023-01-23

- Mongo: In case the `_id` column is an expected output column for a `rollup` step, rename it to `__id`
  to prevent an error.

## [0.28.1] - 2023-01-12

- PyPika: Fixed a bug where pipelines consisting of a single CustomSQL step could not be materialized when their column list was empty.

## [0.28.0] - 2023-01-10

- Pandas: The `top` step now supports non-numeric columns
- PyPika: Manipulating tables whose columns are unknown now throws an exception.

## [0.27.5] - 2022-12-30

- Mongo: In case the `_id` column is an expected output column for an `aggregation` step, rename it to `__id`
  to prevent an error.

## [0.27.4] - 2022-12-27

### Fixed

- Pandas: The `duration` step now works with columns containing datetime.date instances
- Pandas: The `evolution` step now works with columns containing `datetime.date` instances.
- Pandas: The `dateextract` step now works with columns containing `datetime.date` instances.

## [0.27.3] - 2022-12-07

### Fixed

- Pandas: Ensure the `addmissingdates` step always inserts Timestamp objects rather than integers

- MongoTranslator : We make sure the `$switch` aggregation should always have a `default` key
  field set from the mongo query to prevent "PlanExecutor error".

## [0.27.2] - 2022-11-24

- PyPika: Cast columns before applying a regex operation to them when using the `matches` or `notmatches` operator.

## [0.27.1] - 2022-11-07

- Pypika: Snowflake translator custom queryBuilder adds double quotes to `WITH` statements in order to prevent
  "unknown identifier" errors due to case insensitivity.

## [0.27.0] - 2022-11-04

- PyPika: Google Big Query translator now escapes single quotes in string literals with
a backslash (`\'`) rather than two double quotes (`''`).

## [0.26.1] - 2022-10-27

- in order to prevent SQL injection, it is no longer possible to create a CustomSQL step with variables.

## [0.26.0] - 2022-10-20

- Pypika: Snowflake translator now has a custom queryBuilder class to force the `QUOTE_CHAR` to `"`
- Feat: Added `replacetext` step for all backends
- Feat: `text` step now allows to create other types of column (when used in conjunction with variables)

### Breaking
* Dropped support for the old snowflake SQL translator

## [0.25.5] - 2022-10-11

- PyPika: Athena translator now uses `DATE_PARSE` rather than `TIMESTAMP` for the `todate` step
- PyPika: Postgres and Redshift translator now use `TO_TIMESTAMP` rather than `TIMESTAMP` for the `todate` step
- PyPika: The `text` step now does an explicit cast of the input text to the adequate text type
- PyPika: Google Big Query translator now use `PARSE_DATETIME` rather than `TIMESTAMP` for the `todate` step
- Pandas: Fixed the "filter" condition evaluation when operating with naive datetime objects

## [0.25.4] - 2022-10-06

- PyPika: Fixed "unpivot" step for mixed column types by adding intermediate convert step
- PyPika: the float type for MySQL is now DOUBLE
- PyPika: the float type for Google Big Query is now FLOAT64
- PyPika: the float type for Athena is now DOUBLE

## [0.25.3] - 2022-10-04

- PyPika: Fixed "split" step with Google Big Query backend: If provided, the delimiter is now passed wrapped in single quotes.
  Also, empty strings are returned rather than null values, for consistency with other backends
- PyPika: Fixed "split" step with Athena backend: empty strings are returned rather than null values, for consistency with other backends
- PyPika: Fixed "split" step with MySQL backend, in case there are more `keep_columns` than splitted parts, fill those with empty string
  rather than the entire string to split

## [0.25.2] - 2022-09-27

- Fixed "matches" operator behaviour of the IfThenElse step in case the column the condition applies to contains NA values

## [0.25.1] - 2022-09-27

- Bumped geopandas from 0.10.0 -> 0.11.1

## [0.25.0] - 2022-09-27

- PyPika translator: Added support for cumsum step
- PyPika translator: Added support for dateextract step to all translators except MySQL

## [0.24.2] - 2022-09-20

- PyPika translator: SQLDialect now uses the same values than frontend translator names

## [0.24.1] - 2022-09-14

- Formula AST: Change column name parser implementation to be more permissive with column names
  (everything between two square brackets is now considered part of the column name, including
  whitespace)
- Formula AST: Allow string literals to contain quote chars

## [0.24.0] - 2022-09-01

- PyPika translator: Added a `source_rows_subset` options allowing to work only on a subset of domains
- Added missing typing and adapted all typing to python 3.10 syntax

## [0.23.0] - 2022-08-30

- PyPika translator: Changed the way translator IDs are generated in order to have predictible queries. This allows to use
  translated queries as cache keys.
- Refactored the `formula` step in all backends. Formulas are now converted to an AST and evaluated by the
  different backends for increased consistency.

## [0.22.0] - 2022-08-18

- Added Pypika's `UNPIVOT` step

## [0.21.0] - 2022-08-05

- Switched Snowflake backend in the playground to PyPika
- Added a `TO_TIMESTAMP_NTZ` operator to the ToDateOp enum
- Renamed `TIMESTAMP` operator to `TO_TIMESTAMP`
- Bumped dependencies in lockfile

## [0.20.1] - 2022-08-02

- Bumped flake8 and fixed dependency lock file

## [0.20.0] - 2022-08-01

- Pypika: force converted date to timestamps

## [0.19.2] - 2022-08-01

- Pypika: Snowflake Dateextract fix some formulas

## [0.19.1] - 2022-07-29

- The Reference type is now hashable

## [0.19.0] - 2022-07-28

- Pypika: snowflake dateextract step

## [0.18.0] - 2022-07-27

- Pypika: evolution step

## [0.17.3] - 2022-07-06

- CustomSQL step: Sanitize query

## [0.17.2] - 2022-07-01

- Playground: Add missing toucan-connectors[awsathena] dependency

## [0.17.1] - 2022-06-30

- Tests: enable integration tests for Big Query
- Playground: Added support for Big Query and Athena

## [0.17.0] - 2022-06-27

- feat: add step to compute absolute value
- Feat: Add `SUPPORT_ROW_NUMBER` and `SUPPORT_SPLIT_PART` to PyPika Athena translator
- Fix: Return N results for every group in the `top` step of the PyPika translator
- Fix: Ensure RowNumber() has an alias in the `top` step of the PyPika translator
- Fix: Ensure the `top` step of the PyPika translator returns consistent results

## [0.16.1] - 2022-06-22

- Fix: rename the sql dialect used for postgres

## [0.16.0] - 2022-06-22

- Feat: Handle code mode queries in pypika translator

## [0.15.0] - 2022-06-21

- Feat: Add SQL backend powered by PyPika
- Feat: Added a geographical hierarchy step to pandas executor
- Feat: Added a geographical dissolve step to pandas executor
- Feat: Added a geographical simplify step to pandas executor
- Feat: Support joins with geographical data in pandas executor

## [0.14.0] - 2022-06-14

- Changed: deleting a non-existing columns doesn't trigger an error (pandas, SQL)

## [0.13.0] - 2022-06-13

- Move to poetry for dependency management
- Dropped python<3.10 support

## [0.12.6] - 2022-06-06

- Fix parsing error for Step(s) objects from logs
- Updated the parsing format of a step monitoring (pandas)

## [0.12.3] - 2022-06-02

- Added logs for each step under pandas executor

## [0.12.2] - 2022-05-27

- Fix ifthenelse step with date conditions

## [0.12.1] - 2022-05-24

- Fix: handle cumsum legacy syntax aliases

## [0.12.0] - 2022-05-22

- Use discriminated union for faster validation on steps and cleaner error messages

## [0.11.2] - 2022-03-09

- Mongo: Fix Join & Append steps to handle domain steps as str

## [0.11.1] - 2022-03-08

- Mongo: Join step & Append step in python translator


## [0.11.0] - 2022-02-25

- Domain step: support references as an alternative to names
- Cumulated Sum step: handle multiple columns
- Bootstrapped new translators:
  - PostgresSQL: convert, append, fillna, duration & ifthenelse steps
  - Mongo: argmin, argmax, filter & text steps

## [0.10.2] - 2021-12-22

- Postgres translator:
  - add an sql_dialect arg to translator & steps


## [0.10.1] - 2021-12-10

### Fixed

- SQL translator: date-extract step:
  - first day of ISO week (monday)
  - first day of week (sunday)
  - first day of previous ISO week (monday)
  - first day of previous week (sunday)
  - first day of previous month
  - first day of previous quarter
  - first day of previous year
  - day of week (sunday to sunday)
  - previous ISO week number (monday to monday)
  - previous day
  - milliseconds

## [0.10.0] - 2021-12-08

### Changed
- SQL translator: `sql_query_executor` must return directly a `DataFrame`, not a NamedTuple with the attr `df` anymore
