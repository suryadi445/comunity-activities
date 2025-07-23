import { Tabs, TabItem } from "flowbite-react";

export default function TabsComponent({ tabs }) {
    return (
        <Tabs aria-label="Tabs with underline" variant="underline">
            {tabs.map(({ title, content, icon, disabled }, i) => (
                <TabItem
                    key={i}
                    title={
                        <div className="flex items-center">
                            {icon && <span className="mr-2">{icon}</span>}
                            {title}
                        </div>
                    }
                    disabled={disabled}
                >
                    {content}
                </TabItem>
            ))}
        </Tabs>
    );
}
