import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    name: "Basic",
    price: "$29",
    period: "/month",
    description: "For small organizations",
    icon: Zap,
    features: ["Up to 100 users", "2 devices", "Basic analytics", "Email support"],
    current: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    description: "For growing organizations",
    icon: Crown,
    features: ["Up to 500 users", "10 devices", "Advanced analytics", "Priority support", "API access", "Custom reports"],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large institutions",
    icon: Building2,
    features: ["Unlimited users", "Unlimited devices", "Premium analytics", "24/7 support", "Full API access", "Custom reports", "Dedicated manager"],
    current: false,
  },
];

const Billing = () => {
  const { user } = useAuth();
  const trialDays = Math.max(0, Math.ceil((new Date(user?.trialEndsAt || "").getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and payment</p>
      </div>

      {/* Trial Banner */}
      <Card className="gradient-primary-bold border-0">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-primary-foreground">Free Trial Active</h3>
            <p className="text-primary-foreground/80">{trialDays} days remaining · All Pro features included</p>
          </div>
          <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={() => toast.info("Upgrade flow coming soon")}>
            Upgrade now
          </Button>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.name} className={`glass-card relative ${plan.popular ? "ring-2 ring-primary" : ""}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary-bold text-primary-foreground border-0">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <plan.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full mt-6 ${plan.popular ? "gradient-primary-bold text-primary-foreground" : ""}`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => toast.info(`${plan.name} plan selected`)}
              >
                {plan.current ? "Current plan" : `Choose ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">No payments yet — you're on a free trial</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
