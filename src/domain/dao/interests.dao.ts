export interface InterestsDao {
  getInterests()
  getInterestsByIds(ids: number[])
}
