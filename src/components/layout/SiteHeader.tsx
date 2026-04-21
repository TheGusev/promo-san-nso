import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { SITE_CONFIG } from "@/data/siteConfig";
import { getAllServices } from "@/data/services";
import { getInsects, getRodents } from "@/data/pests";
import { getResidentialObjects, getCommercialObjects, getIndustrialObjects } from "@/data/objects";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const services = getAllServices();
  const insects = getInsects();
  const rodents = getRodents();
  const residentialObjects = getResidentialObjects();
  const commercialObjects = getCommercialObjects();
  const industrialObjects = getIndustrialObjects();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar - скрыт на мобиле */}
      <div className="border-b bg-muted/30 hidden sm:block">
        <div className="container flex h-10 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <a
              href={`tel:${SITE_CONFIG.phoneClean}`}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">{SITE_CONFIG.phoneDisplay}</span>
            </a>
            <span className="hidden md:inline text-xs text-muted-foreground">
              {SITE_CONFIG.workingHoursText}
            </span>
          </div>
          <Button size="sm" className="h-8" asChild>
            <a href={`tel:${SITE_CONFIG.phoneClean}`}>Заказать обработку</a>
          </Button>
        </div>
      </div>

      {/* Main header */}
      <div className="container flex h-14 items-center justify-between px-3 sm:px-4 gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <span className="truncate text-base sm:text-lg lg:text-xl font-bold text-primary leading-tight">
            Санитарные Решения
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {/* Услуги */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Услуги</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                  {services.map((service) => (
                    <li key={service.slug}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={`/usluga/${service.slug}`}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{service.name}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {service.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li className="col-span-2">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/uslugi"
                        className="block select-none rounded-md p-3 text-center font-medium text-primary hover:bg-accent transition-colors"
                      >
                        Все услуги →
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Вредители */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Вредители</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[500px] p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-muted-foreground">Насекомые</h4>
                      <ul className="space-y-1">
                        {insects.slice(0, 6).map((pest) => (
                          <li key={pest.slug}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/vreditel/${pest.slug}`}
                                className="block rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                              >
                                {pest.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-muted-foreground">Грызуны</h4>
                      <ul className="space-y-1">
                        {rodents.map((pest) => (
                          <li key={pest.slug}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/vreditel/${pest.slug}`}
                                className="block rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                              >
                                {pest.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Link
                    to="/vrediteli"
                    className="mt-4 block text-center text-sm font-medium text-primary hover:underline"
                  >
                    Все вредители →
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Объекты */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Объекты</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[500px] p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-muted-foreground">Жильё</h4>
                      <ul className="space-y-1">
                        {residentialObjects.map((obj) => (
                          <li key={obj.slug}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/obekt/${obj.slug}`}
                                className="block rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                              >
                                {obj.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-muted-foreground">Бизнес</h4>
                      <ul className="space-y-1">
                        {commercialObjects.slice(0, 5).map((obj) => (
                          <li key={obj.slug}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/obekt/${obj.slug}`}
                                className="block rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                              >
                                {obj.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-muted-foreground">Другое</h4>
                      <ul className="space-y-1">
                        {industrialObjects.map((obj) => (
                          <li key={obj.slug}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/obekt/${obj.slug}`}
                                className="block rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                              >
                                {obj.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Link
                    to="/obekty"
                    className="mt-4 block text-center text-sm font-medium text-primary hover:underline"
                  >
                    Все объекты →
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Простые ссылки */}
            <NavigationMenuItem>
              <Link
                to="/rayony"
                className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                )}
              >
                Районы
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/blog"
                className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                )}
              >
                Блог
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                to="/faq"
                className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                )}
              >
                Вопросы
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Theme toggle + mobile menu */}
        <div className="ml-auto lg:ml-2 flex items-center gap-1">
          <ThemeToggle />

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9 lg:h-10 lg:w-10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Меню</span>
              </Button>
            </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-80">
            <div className="flex flex-col gap-4 mt-8">
              <MobileNavSection title="Услуги" defaultOpen>
                {services.map((service) => (
                  <SheetClose asChild key={service.slug}>
                    <Link
                      to={`/usluga/${service.slug}`}
                      className="block py-2 text-sm hover:text-primary transition-colors"
                    >
                      {service.name}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link to="/uslugi" className="block py-2 text-sm font-medium text-primary">
                    Все услуги →
                  </Link>
                </SheetClose>
              </MobileNavSection>

              <MobileNavSection title="Вредители">
                {[...insects.slice(0, 4), ...rodents.slice(0, 2)].map((pest) => (
                  <SheetClose asChild key={pest.slug}>
                    <Link
                      to={`/vreditel/${pest.slug}`}
                      className="block py-2 text-sm hover:text-primary transition-colors"
                    >
                      {pest.name}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link to="/vrediteli" className="block py-2 text-sm font-medium text-primary">
                    Все вредители →
                  </Link>
                </SheetClose>
              </MobileNavSection>

              <MobileNavSection title="Объекты">
                {[...residentialObjects.slice(0, 2), ...commercialObjects.slice(0, 2)].map((obj) => (
                  <SheetClose asChild key={obj.slug}>
                    <Link
                      to={`/obekt/${obj.slug}`}
                      className="block py-2 text-sm hover:text-primary transition-colors"
                    >
                      {obj.name}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link to="/obekty" className="block py-2 text-sm font-medium text-primary">
                    Все объекты →
                  </Link>
                </SheetClose>
              </MobileNavSection>

              <SheetClose asChild>
                <Link to="/rayony" className="py-2 text-sm font-medium hover:text-primary transition-colors">
                  Районы
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link to="/blog" className="py-2 text-sm font-medium hover:text-primary transition-colors">
                  Блог
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link to="/faq" className="py-2 text-sm font-medium hover:text-primary transition-colors">
                  Вопросы
                </Link>
              </SheetClose>

              <div className="mt-4 pt-4 border-t">
                <a
                  href={`tel:${SITE_CONFIG.phoneClean}`}
                  className="flex items-center gap-2 py-2 text-lg font-medium text-primary"
                >
                  <Phone className="h-5 w-5" />
                  {SITE_CONFIG.phoneDisplay}
                </a>
                <p className="text-sm text-muted-foreground">{SITE_CONFIG.workingHoursText}</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

// Компонент для мобильной навигации с раскрытием
function MobileNavSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b pb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-sm font-medium"
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && <div className="pl-4">{children}</div>}
    </div>
  );
}
