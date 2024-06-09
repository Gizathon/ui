import { PublicClient, createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";

class ClientProvider {
  private static instance: ClientProvider | null = null;

  private publicClient: PublicClient | null = null;

  private currentChainId: number | null = null;

  private constructor() {
    // private constructor
  }

  public static getInstance(): ClientProvider {
    if (!ClientProvider.instance) {
      ClientProvider.instance = new ClientProvider();
    }
    return ClientProvider.instance;
  }

  public getPublicClient({ chainId }: { chainId: number }): PublicClient {
    if (!this.publicClient || chainId !== this.currentChainId) {
      try {
        this.currentChainId = chainId;
        this.publicClient = createPublicClient({
          chain: arbitrum,
          transport: http(),
        });
      } catch (error) {
        throw new Error("Error creating Viem Public Client");
      }
    }
    return this.publicClient;
  }
}

export default ClientProvider;
