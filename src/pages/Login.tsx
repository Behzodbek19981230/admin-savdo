import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Lock, User, LogIn, TrendingUp, ShoppingCart, Users, DollarSign, Package, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { authService } from "@/services";

// Validation schema
const loginSchema = z.object({
    username: z.string()
        .min(3, "Username kamida 3 ta belgidan iborat bo'lishi kerak")
        .max(50, "Username juda uzun"),
    password: z.string()
        .min(4, "Parol kamida 4 ta belgidan iborat bo'lishi kerak")
        .max(100, "Parol juda uzun"),
    rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);

        try {
            await authService.login({
                username: data.username,
                password: data.password,
            });

            localStorage.setItem("isAuthenticated", "true");
            await authService.getCurrentUser();

            toast({
                title: "Xush kelibsiz!",
                description: "Tizimga muvaffaqiyatli kirdingiz.",
            });

            navigate("/");
        } catch (error) {
            toast({
                title: "Xatolik yuz berdi",
                description: "Username yoki parol noto'g'ri.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
            {/* Theme Toggle - Top Right */}
            <div className="absolute top-4 right-4 z-20">
                <ThemeToggle />
            </div>

            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-success/10 dark:from-primary/5 dark:via-background dark:to-success/5" />

            {/* Floating Icons Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Top Left - Shopping Cart */}
                <div className="absolute top-20 left-20 opacity-10 animate-float">
                    <ShoppingCart className="w-24 h-24 text-primary" />
                </div>

                {/* Top Right - Trending */}
                <div className="absolute top-32 right-32 opacity-10 animate-float-delayed">
                    <TrendingUp className="w-32 h-32 text-success" />
                </div>

                {/* Bottom Left - Users */}
                <div className="absolute bottom-40 left-32 opacity-10 animate-float-slow">
                    <Users className="w-28 h-28 text-info" />
                </div>

                {/* Bottom Right - Dollar */}
                <div className="absolute bottom-32 right-24 opacity-10 animate-float">
                    <DollarSign className="w-36 h-36 text-warning" />
                </div>

                {/* Center Left - Package */}
                <div className="absolute top-1/2 left-10 -translate-y-1/2 opacity-10 animate-float-delayed">
                    <Package className="w-20 h-20 text-primary" />
                </div>

                {/* Center Right - Chart */}
                <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-10 animate-float-slow">
                    <BarChart3 className="w-24 h-24 text-success" />
                </div>

                {/* Additional decorative circles */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-success/5 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Info */}
                <div className="hidden lg:block space-y-8 px-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black text-foreground leading-tight">
                            <span className="text-primary">Smart Savdo</span> <br />
                            Biznesingizni <br />
                            Osonlashtiring
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Smart Savdo tizimi bilan savdo jarayonlaringizni boshqaring,
                            mijozlar bilan munosabatlarni kuchaytiring va daromadingizni oshiring.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 transition-all duration-300">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">Sotuvni Kuzating</h3>
                                <p className="text-sm text-muted-foreground">
                                    Real vaqtda savdo statistikasi va hisobotlar
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 transition-all duration-300">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 flex-shrink-0">
                                <Users className="h-6 w-6 text-success" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">Mijozlarni Boshqaring</h3>
                                <p className="text-sm text-muted-foreground">
                                    Barcha mijozlar ma'lumotlari bir joyda
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 transition-all duration-300">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10 flex-shrink-0">
                                <BarChart3 className="h-6 w-6 text-warning" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">Analytics Dashboard</h3>
                                <p className="text-sm text-muted-foreground">
                                    Kuchli tahlil vositalari va vizualizatsiya
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="text-center p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30">
                            <div className="text-3xl font-black text-primary mb-1">10K+</div>
                            <div className="text-sm text-muted-foreground">Foydalanuvchi</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30">
                            <div className="text-3xl font-black text-success mb-1">98%</div>
                            <div className="text-sm text-muted-foreground">Mamnunlik</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30">
                            <div className="text-3xl font-black text-warning mb-1">24/7</div>
                            <div className="text-sm text-muted-foreground">Qo'llab-quvvatlash</div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Card */}
                <Card className="w-full shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
                            <LogIn className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-2xl lg:text-3xl font-bold">Tizimga kirish</CardTitle>
                        <CardDescription className="text-sm lg:text-base">
                            Davom etish uchun hisobingizga kiring
                        </CardDescription>
                    </CardHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-4">
                                {/* Username Field */}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="username"
                                                        className="pl-10 h-11"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Password Field */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Parol</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        className="pl-10 pr-10 h-11"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <FormField
                                        control={form.control}
                                        name="rememberMe"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-medium cursor-pointer">
                                                    Eslab qolish
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="px-0 text-sm font-medium"
                                    >
                                        Parolni unutdingizmi?
                                    </Button>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col space-y-4">
                                <Button
                                    type="submit"
                                    className="w-full h-11 text-base font-semibold"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                            Yuklanmoqda...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <LogIn className="h-4 w-4" />
                                            Kirish
                                        </div>
                                    )}
                                </Button>

                                <div className="text-center text-sm text-muted-foreground">
                                    Hisobingiz yo'qmi?{" "}
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="px-1 font-semibold text-primary"
                                    >
                                        Ro'yxatdan o'tish
                                    </Button>
                                </div>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
