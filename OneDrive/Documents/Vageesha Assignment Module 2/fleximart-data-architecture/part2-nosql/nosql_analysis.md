# NoSQL Database Analysis for FlexiMart Product Catalog
This document analyzes the limitations of using a relational database
for managing a highly diverse product catalog at FlexiMart and evaluates
the suitability of MongoDB as a NoSQL alternative. It also highlights
key trade-offs involved in adopting MongoDB.

## Section A: Limitations of RDBMS
Relational databases such as MySQL struggle when managing highly diverse
product catalogs like FlexiMart’s. Different products often have different
attributes; for example, laptops require fields such as RAM, processor, and
storage, while shoes require size, color, and material. In a relational model,
this leads to wide tables with many nullable columns or multiple auxiliary
tables, making queries complex and inefficient.

Frequent schema changes are another challenge. Adding new product types
requires ALTER TABLE operations, which are costly, risky in production, and
can cause downtime. This limits agility when business teams want to onboard
new categories quickly.

Additionally, storing customer reviews as nested data is not natural in
RDBMS. Reviews require separate tables and joins, increasing query complexity
and reducing read performance. As product data grows in variety and volume,
these constraints make relational databases less flexible for evolving
e-commerce needs.


## Section B: Benefits of Using MongoDB
MongoDB addresses these challenges through its flexible document-based
schema. Each product can be stored as a JSON-like document with attributes
specific to its category. For example, laptops can include RAM and processor
fields, while shoes can include size and color, without impacting other
documents. This eliminates the need for complex table designs or frequent
schema changes.

MongoDB also supports embedded documents, allowing customer reviews to be
stored directly within product documents. This improves read performance by
eliminating joins and makes data retrieval simpler and more intuitive for
application developers.

In addition, MongoDB is designed for horizontal scalability. As FlexiMart’s
product catalog and user traffic grow, MongoDB can scale across multiple
servers using sharding. This makes it well-suited for handling large volumes
of semi-structured product data while maintaining performance and
availability.


## Section C: Trade-offs of Using MongoDB
Despite its flexibility, MongoDB has trade-offs compared to MySQL. First,
MongoDB provides weaker transactional guarantees for complex multi-document
operations. While it supports ACID transactions, they are generally more
expensive and less mature than those in relational databases.

Second, MongoDB lacks strong support for complex joins and relational queries.
Analytical queries that involve relationships across multiple entities can
be more difficult and less efficient to implement. As a result, MongoDB is
best suited for operational workloads, while relational databases may still
be preferred for financial reporting and transactional consistency.

