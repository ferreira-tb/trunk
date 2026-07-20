type Option<T> = import("@tb-dev/utils").Option<T>;

interface TrunkEntry {
  readonly amount: number;
  readonly card_id: string;
  readonly name: string;
  readonly name_pt: Option<string>;
  readonly description: string;
  readonly card_type: string;
  readonly archetype: Option<string>;
  readonly ygoprodeck_url: Option<string>;
  readonly banlist_status: Option<string>;
}
