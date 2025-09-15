'use client';
import * as LucideIcons from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { useState } from 'react';

// A more robust way to filter for actual icon components
const iconNames = Object.keys(LucideIcons).filter((key) => {
    const exportValue = (LucideIcons as any)[key];
    return (
      typeof exportValue === 'object' &&
      exportValue !== null &&
      'render' in exportValue &&
      typeof exportValue.render === 'function' &&
      !key.includes('Provider')
    );
});


export function IconPicker({ value, onChange }: { value?: string, onChange: (value: string) => void }) {
    const [open, setOpen] = useState(false);

    const Icon = value && (LucideIcons as any)[value] ? (LucideIcons as any)[value] : LucideIcons.HelpCircle;
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="w-10 h-10">
                    <Icon className="h-5 w-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[200px]">
                <Command>
                    <CommandInput placeholder="Search icon..." />
                    <CommandList>
                        <CommandEmpty>No icon found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                            {iconNames.map((name) => {
                                const LoopIcon = (LucideIcons as any)[name];
                                return (
                                    <CommandItem
                                        key={name}
                                        value={name}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue === value ? '' : name);
                                            setOpen(false);
                                        }}
                                        className="flex items-center gap-2"
                                    >
                                        <LoopIcon className="h-5 w-5" />
                                        <span>{name}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
