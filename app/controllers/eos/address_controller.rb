class Eos::AddressController < NetworkController
  layout 'tabs'

  before_action :query_graphql, :redirect_by_type

  QUERY = BitqueryGraphql::Client.parse <<-'GRAPHQL'
  query($address: String!){
  eos {
    address(address: {is: $address}) {
      address
      smartContract {
        contractType
        protocolType
      currency {
        symbol
        name
        tokenType
        decimals
      }
      }
      
    }
  }
}
  GRAPHQL

  QUERY_CURRENCIES = BitqueryGraphql::Client.parse <<-'GRAPHQL'
   query($address: String!) {
              eos{
address(address: {is: $address}) {
      address
      smartContract {
        contractType
        protocolType
      currency {
        symbol
        name
        tokenType
        decimals
      }
      }
      
    }
    						transfers(receiver: {is: $address}, options: {desc: "count", limit: 100}){
      							currency {
                      address
                      symbol
                      name
                    }
      							count
    						}
              }
            }
  GRAPHQL

  private

  def query_graphql
      @address = params[:address]
      query = action_name == 'money_flow' ? QUERY_CURRENCIES : QUERY
      result = BitqueryGraphql.instance.query_with_retry(query, variables: { address: @address }).data.eos
      @info = result.address.first
      @currencies = result.transfers.map(&:currency).sort_by { |c| c.address == 'eosio.token' ? 0 : 1 }.uniq { |x| x.address } if result.try(:transfers)
  end

  def redirect_by_type
    if sc = @info.try(:smart_contract)
      change_controller! (sc.currency ? 'eos/token' : 'eos/smart_contract')
    end
  end

end
