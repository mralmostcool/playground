src/
  modules/
    reference-data/
      rank/              -> rank_master
      institute/          -> institute

    seafarer/
      seafarer/           -> indos_master
      enrollment/          -> enrollment  (FK: indos_master, pre_sea_courses)

    course/
      course/              -> pre_sea_courses  (FK: institute)

    shipping/
      company/             -> company
      vessel/              -> vessel  (FK: company)
      berth/               -> berth
      berth-allocation/    -> berth_allocation  (FK: berth, vessel)

    training/
      berth-assignment/    -> berth_seafarer_allocation (FK: berth, indos_master, berth_allocation)
      contract/            -> contract (FK: indos_master, company, enrollment, berth_seafarer_allocation)

    audit/
      audit-log/           -> audit_logs