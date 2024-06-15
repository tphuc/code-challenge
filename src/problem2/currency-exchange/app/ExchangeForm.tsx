'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { ExchangeSchema } from "./schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"

import useSWR from 'swr'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { ChangeEvent, useRef, useState } from "react"
import { z } from "zod"
import { Loader2 } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface CurrencyRate {
    currency: string;
    price: number
}

const mockAsyncResponse = (timer: number): Promise<null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, timer);
    });
};

function getExchangeRate(exchangePrices: CurrencyRate[], sourceCurrency: any, targetCurrency: any) {
    let sourcePrice = null;
    let targetPrice = null;

    // Iterate through the exchange prices to find the latest prices for the source and target currencies
    for (let record of exchangePrices) {
        if (record.currency === sourceCurrency) {
            sourcePrice = record.price;
        } else if (record.currency === targetCurrency) {
            targetPrice = record.price;
        }
    }

    // If either price is not found, return an error message
    if (sourcePrice === null) {
        throw new Error(`Source currency ${sourceCurrency} not found.`);
    }
    if (targetPrice === null) {
        throw new Error(`Target currency ${targetCurrency} not found.`);
    }

    // Calculate and return the exchange rate
    const exchangeRate = sourcePrice / targetPrice;
    return exchangeRate;
}


function filterUniqueCurrencies(exchangePrices: CurrencyRate[]) {
    const seenCurrencies = new Set();

    return exchangePrices.filter(record => {
        if (seenCurrencies.has(record.currency)) {
            return false;
        } else {
            seenCurrencies.add(record.currency);
            return true;
        }
    });
}

export default function ExchangeForm() {

    const [loading, setLoading] = useState<boolean>(false)
    const { data: exchangePrices, isLoading: fetchIsLoading } = useSWR('https://interview.switcheo.com/prices.json', async (url) => {
        let res = await fetch(url, { method: "GET" })
        return await res.json() as CurrencyRate[]
    }, {
        refreshInterval: 2000,
        revalidateIfStale: true,
        revalidateOnFocus: true,
        revalidateOnMount: true
    })

    const sourceInputRef = useRef<HTMLInputElement>(null)
    const targetInputRef = useRef<HTMLInputElement>(null)

    const form = useForm({
        resolver: zodResolver(z.object({
            source: z.string().regex(/^\d+(\.\d{1,4})?$/, '').transform((val) => parseFloat(val)),
            target: z.string().regex(/^\d+(\.\d{1,4})?$/, '').transform((val) => parseFloat(val)),
            sourceToken: z.string().optional().default('USD'),
            targetToken: z.string().optional()
        })),
        defaultValues: {
            source: '',
            target: '',
            sourceToken: 'USD',
            targetToken: undefined
        }
    })

    let uniqueExchangePrices = filterUniqueCurrencies(exchangePrices ?? [])


    const onSubmit = async (values: any) => {
        try {
            setLoading(true)
            await mockAsyncResponse(2000)
            setLoading(false)
            toast({
                title: 'Swap succesfully',
                description: `Your currency swap from ${values?.sourceToken} to ${values?.targetToken} has been completed successfully`
            })
        }
        catch (e) {
            toast({
                title: 'An error has occured',
            })
            setLoading(false)
        }
    }

    const handleSourceChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value as string;
        if (!parseFloat(value)) return

        try {
            let aToken = form.getValues('sourceToken')
            let bToken = form.getValues('targetToken')
            if (bToken && aToken) {
                let exchangeRate = getExchangeRate(uniqueExchangePrices, aToken, bToken)
                let newVal = exchangeRate * parseFloat(value)
                form?.setValue?.('target', `${newVal.toFixed(4)}`, { shouldValidate: true })
            }
        } catch (e) { }
    }

    const handleTargetChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value as string;
        if (!parseFloat(value)) return


        try {
            let aToken = form.getValues('targetToken')
            let bToken = form.getValues('sourceToken')

            if (aToken && bToken) {
                let exchangeRate = getExchangeRate(uniqueExchangePrices, aToken, bToken)
                let newVal = exchangeRate * parseFloat(value)
                form?.setValue?.('source', `${newVal.toFixed(4)}`, { shouldValidate: true })
            }
        } catch (e) { }
    }

    if (fetchIsLoading) {
        return <div className="grid w-full gap-2">
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
        </div>
    }

    return <div>

        <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">

                <div className="bg-white/60 transition transition-all rounded-xl p-4 pt-2 pr-2 border-2 border-transparent hover:border-slate-800">
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-sm">Sell</p>
                        <FormField
                            control={form.control}
                            name="sourceToken"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={(val) => {
                                        field.onChange(val);
                                        try {
                                            let value = form.getValues('target')
                                            if (!value) return
                                            if (form.getValues('targetToken')) {
                                                let exchangeRate = getExchangeRate(uniqueExchangePrices, form.getValues('targetToken'), val)
                                                let newVal = exchangeRate * parseFloat(value)
                                                form?.setValue?.('source', `${newVal.toFixed(4)}`, { shouldValidate: true })
                                            }
                                        } catch (e) { }

                                    }} defaultValue={field.value} >
                                        <FormControl>
                                            <SelectTrigger className="text-sm h-8 bg-white px-2 rounded-full" >
                                                <SelectValue placeholder="Select" className="flex items-center" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {uniqueExchangePrices?.map((item, id) => <SelectItem key={id} value={item?.currency} disabled={item.currency === form.watch('targetToken')}>
                                                <div className="flex items-center flex-wrap gap-2">
                                                    <Image width={300} height={300} alt='' className="w-[20px] h-[20px]" src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item?.currency}.svg`} />
                                                    <span> {item?.currency} </span>
                                                </div>
                                            </SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormControl>
                                    <Input className="border-none shadow-none px-0 text-lg" {...field} ref={sourceInputRef} onChange={(e) => {

                                        field.onChange(e)
                                        if (e.target == sourceInputRef.current)
                                            handleSourceChange(e)
                                    }} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="bg-white/60 transition transition-all rounded-xl p-4 pt-2 pr-2 border-2 border-transparent hover:border-slate-800">
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-sm">Buy</p>
                        <FormField
                            control={form.control}
                            name="targetToken"
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        onValueChange={(val) => {
                                            field.onChange(val)
                                            try {
                                                let value = form.getValues('target')
                                                if (!value) return
                                                if (form.getValues('sourceToken')) {
                                                    let exchangeRate = getExchangeRate(uniqueExchangePrices, form.getValues('sourceToken'), val)
                                                    let newVal = exchangeRate * parseFloat(value)
                                                    form?.setValue?.('target', `${newVal.toFixed(4)}`, { shouldValidate: true })
                                                }
                                            } catch (e) { }
                                        }}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="text-sm h-8 bg-white px-2 rounded-full" >
                                                <SelectValue placeholder="Select" className="flex items-center" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {uniqueExchangePrices?.map((item, id) => <SelectItem key={id} disabled={item.currency === form.watch('sourceToken')} value={item?.currency}>
                                                <div className="flex items-center flex-wrap gap-2">
                                                    <Image width={300} height={300} alt='' className="w-[20px] h-[20px]" src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item?.currency}.svg`} />
                                                    <span> {item?.currency} </span>
                                                </div>
                                            </SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="target"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input className="border-none shadow-none px-0 text-lg"  {...field} ref={targetInputRef} onChange={(e) => {
                                        field.onChange(e)
                                        if (e.target == targetInputRef.current)
                                            handleTargetChange(e)
                                    }} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type='submit' disabled={loading || (!form.watch('source') && !form.watch('target'))} className="w-full gap-4 rounded-xl h-12" size={'lg'}>
                    Confirm

                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                </Button>

            </form>
        </Form>

    </div>
}