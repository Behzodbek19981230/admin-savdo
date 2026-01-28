/**
 * Add Products Dialog Component
 * Kategoriya bo'yicha mahsulotlarni qo'shish dialogi
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useProductCategories } from '@/hooks/api/useProductCategories';
import { useProductModels } from '@/hooks/api/useProductModels';
import { useModelTypes } from '@/hooks/api/useModelTypes';
import { useModelSizes } from '@/hooks/api/useModelSizes';
import { useCreateProduct } from '@/hooks/api/useProducts';

interface AddProductsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Product item schema
const productItemSchema = z.object({
    model: z.number({ required_error: 'Model majburiy' }).int().positive(),
    model_type: z.number({ required_error: 'Model turi majburiy' }).int().positive(),
    model_size: z.number({ required_error: 'Model o\'lchami majburiy' }).int().positive(),
    count: z.number({ required_error: 'Soni majburiy' }).int().min(0),
    real_price: z.number({ required_error: 'Haqiqiy narx majburiy' }).min(0),
    price: z.number({ required_error: 'Sotuv narxi majburiy' }).min(0),
    sorting: z.number().int().nullable().optional(),
});

type ProductItemFormData = z.infer<typeof productItemSchema>;

interface ProductItem extends ProductItemFormData {
    id: string; // temporary ID for frontend
}

export function AddProductsDialog({ open, onOpenChange }: AddProductsDialogProps) {
    const [step, setStep] = useState<'category' | 'products'>('category');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
    const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Queries
    const { data: categoriesData } = useProductCategories({
        perPage: 1000,
        is_delete: false,
    });

    const { data: modelsData } = useProductModels({
        perPage: 1000,
        is_delete: false,
    });

    const { data: modelTypesData } = useModelTypes({
        perPage: 1000,
        is_delete: false,
    });

    const { data: modelSizesData } = useModelSizes({
        perPage: 1000,
        is_delete: false,
    });

    const createProduct = useCreateProduct();

    const categories = categoriesData?.results || [];
    const models = modelsData?.results || [];
    const modelTypes = modelTypesData?.results || [];
    const modelSizes = modelSizesData?.results || [];

    // Form for product item
    const form = useForm<ProductItemFormData>({
        resolver: zodResolver(productItemSchema),
        defaultValues: {
            model: 0,
            model_type: 0,
            model_size: 0,
            count: 0,
            real_price: 0,
            price: 0,
            sorting: null,
        },
    });

    const handleCategorySelect = (categoryId: number) => {
        setSelectedCategory(categoryId);
        setStep('products');
    };

    const handleBack = () => {
        setStep('category');
        setSelectedCategory(null);
        setProducts([]);
    };

    const handleOpenItemDialog = (item?: ProductItem) => {
        if (item) {
            setEditingProduct(item);
            form.reset({
                model: item.model,
                model_type: item.model_type,
                model_size: item.model_size,
                count: item.count,
                real_price: item.real_price,
                price: item.price,
                sorting: item.sorting,
            });
        } else {
            setEditingProduct(null);
            form.reset({
                model: 0,
                model_type: 0,
                model_size: 0,
                count: 0,
                real_price: 0,
                price: 0,
                sorting: null,
            });
        }
        setIsItemDialogOpen(true);
    };

    const handleCloseItemDialog = () => {
        setIsItemDialogOpen(false);
        setEditingProduct(null);
        form.reset();
    };

    const onSubmitItem = (data: ProductItemFormData) => {
        if (editingProduct) {
            // Update existing item
            setProducts(products.map(p => p.id === editingProduct.id ? { ...data, id: p.id } : p));
        } else {
            // Add new item
            const newItem: ProductItem = {
                ...data,
                id: `temp-${Date.now()}`,
            };
            setProducts([...products, newItem]);
        }
        handleCloseItemDialog();
    };

    const handleDeleteItem = (id: string) => {
        setDeletingId(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (deletingId) {
            setProducts(products.filter(p => p.id !== deletingId));
            setDeletingId(null);
            setIsDeleteDialogOpen(false);
        }
    };

    const handleSaveAll = async () => {
        if (!selectedCategory || products.length === 0) return;

        setIsSaving(true);
        try {
            // Save all products
            for (const product of products) {
                await createProduct.mutateAsync({
                    category: selectedCategory,
                    model: product.model,
                    model_type: product.model_type,
                    model_size: product.model_size,
                    count: product.count,
                    real_price: product.real_price,
                    price: product.price,
                    sorting: product.sorting,
                });
            }

            // Reset and close
            handleClose();
        } catch (error) {
            console.error('Error saving products:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setStep('category');
        setSelectedCategory(null);
        setProducts([]);
        setEditingProduct(null);
        onOpenChange(false);
    };

    const getModelName = (modelId: number) => {
        return models.find(m => m.id === modelId)?.name || '-';
    };

    const getModelTypeName = (modelTypeId: number) => {
        return modelTypes.find(mt => mt.id === modelTypeId)?.name || '-';
    };

    const getModelSizeName = (modelSizeId: number) => {
        return modelSizes.find(ms => ms.id === modelSizeId)?.size.toString() || '-';
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
    };

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {step === 'category' ? 'Kategoriya tanlang' : 'Mahsulotlar qo\'shish'}
                        </DialogTitle>
                        <DialogDescription>
                            {step === 'category'
                                ? 'Mahsulot qo\'shish uchun kategoriyani tanlang'
                                : `${categories.find(c => c.id === selectedCategory)?.name} kategoriyasi uchun mahsulotlar`}
                        </DialogDescription>
                    </DialogHeader>

                    {step === 'category' ? (
                        <div className="grid gap-3 py-4">
                            {categories.map((category) => (
                                <Card
                                    key={category.id}
                                    className="cursor-pointer hover:bg-accent transition-colors"
                                    onClick={() => handleCategorySelect(category.id)}
                                >
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            <Package className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="font-medium">{category.name}</p>
                                                {category.sorting && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Tartib: {category.sorting}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Badge variant="secondary">Tanlash</Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Button variant="ghost" size="sm" onClick={handleBack}>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Orqaga
                                </Button>
                                <Button onClick={() => handleOpenItemDialog()}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Mahsulot qo'shish
                                </Button>
                            </div>

                            {products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg">
                                    <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
                                    <p className="text-muted-foreground">Mahsulotlar yo'q</p>
                                    <p className="text-sm text-muted-foreground">
                                        Mahsulot qo'shish tugmasini bosing
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {products.map((product) => (
                                        <Card key={product.id}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 grid grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <span className="text-muted-foreground">Model:</span>
                                                            <p className="font-medium">{getModelName(product.model)}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Model turi:</span>
                                                            <p className="font-medium">{getModelTypeName(product.model_type)}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Model o'lchami:</span>
                                                            <p className="font-medium">{getModelSizeName(product.model_size)}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Soni:</span>
                                                            <p className="font-medium">{product.count}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Haqiqiy narx:</span>
                                                            <p className="font-medium">{formatPrice(product.real_price)}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Sotuv narxi:</span>
                                                            <p className="font-medium text-green-600">{formatPrice(product.price)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenItemDialog(product)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteItem(product.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button variant="outline" onClick={handleClose}>
                                    Bekor qilish
                                </Button>
                                <Button
                                    onClick={handleSaveAll}
                                    disabled={products.length === 0 || isSaving}
                                >
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Hammasini saqlash ({products.length})
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Product Item Dialog */}
            <Dialog open={isItemDialogOpen} onOpenChange={handleCloseItemDialog}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitItem)}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
                                </DialogTitle>
                                <DialogDescription>
                                    Mahsulot ma'lumotlarini kiriting
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="model"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Model *</FormLabel>
                                                <Select
                                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                                    value={field.value?.toString()}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Tanlang" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {models.map((model) => (
                                                            <SelectItem key={model.id} value={model.id.toString()}>
                                                                {model.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="model_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Model turi *</FormLabel>
                                                <Select
                                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                                    value={field.value?.toString()}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Tanlang" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {modelTypes.map((modelType) => (
                                                            <SelectItem
                                                                key={modelType.id}
                                                                value={modelType.id.toString()}
                                                            >
                                                                {modelType.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="model_size"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Model o'lchami *</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(parseInt(value))}
                                                value={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Tanlang" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {modelSizes.map((modelSize) => (
                                                        <SelectItem
                                                            key={modelSize.id}
                                                            value={modelSize.id.toString()}
                                                        >
                                                            {modelSize.size}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="count"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Soni *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="10"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value === '' ? 0 : parseInt(value));
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="sorting"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tartib raqami</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="1"
                                                        {...field}
                                                        value={field.value ?? ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value === '' ? null : parseInt(value));
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="real_price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Haqiqiy narx *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="1000000"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value === '' ? 0 : parseFloat(value));
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormDescription>Tan narxi (so'mda)</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sotuv narxi *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="1200000"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value === '' ? 0 : parseFloat(value));
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormDescription>Sotish narxi (so'mda)</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={handleCloseItemDialog}>
                                    Bekor qilish
                                </Button>
                                <Button type="submit">
                                    {editingProduct ? 'Saqlash' : 'Qo\'shish'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ishonchingiz komilmi?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu mahsulot ro'yxatdan o'chiriladi.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>
                            O'chirish
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
